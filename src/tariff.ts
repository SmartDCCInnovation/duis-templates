/*
 * Created on Thu Jul 20 2023
 *
 * Copyright (c) 2023 Smart DCC Limited
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import {
  RequestId,
  SimplifiedDuisOutputRequest,
  XMLData,
  lookupCV,
  lookupSRV,
} from '@smartdcc/duis-parser'
import { Tariff } from './tariff.dto'

export function singlify(d: XMLData[]): XMLData[] | XMLData {
  if (d.length === 1) {
    return d[0]
  }
  return d
}

export function buildDate(d: {
  year?: number
  month?: number
  dayOfMonth?: number
  dayOfWeek?: number
}): XMLData {
  return {
    Year:
      d.year === undefined
        ? { NonSpecifiedYear: '' }
        : { SpecifiedYear: `${d.year}` },
    Month:
      d.month === undefined
        ? { NonSpecifiedMonth: '' }
        : d.month === 0xfd
        ? { SecondLastDayOfMonth: '' }
        : d.month === 0xfe
        ? { LastDayOfMonth: '' }
        : { SpecifiedMonth: `${d.month}` },
    DayOfMonth:
      d.dayOfMonth === undefined
        ? { NonSpecifiedDayOfMonth: '' }
        : { SpecifiedDayOfMonth: `${d.dayOfMonth}` },
    DayOfWeek:
      d.dayOfWeek === undefined
        ? { NonSpecifiedDayOfWeek: '' }
        : { SpecifiedDayOfWeek: `${d.dayOfWeek}` },
  }
}

/**
 * Builds SRV 1.1.1 from a Tariff object
 *
 * @param t Tariff object
 * @param requestId
 * @returns
 */
export function buildUpdateImportTariff_PrimaryElement(
  t: Tariff,
  requestId: RequestId<bigint>,
): SimplifiedDuisOutputRequest {
  const serviceReferenceVariant = lookupSRV('1.1.1')
  if (serviceReferenceVariant === undefined) {
    throw new Error('unable to lookup srv 1.1.1')
  }

  const Seasons: XMLData = {
    Season: singlify(
      t.seasons.map(
        (season): XMLData => ({
          SeasonName: season.name,
          SeasonStartDate: buildDate(season),
          ReferencedWeekName: `${season.weekProfile}`,
        }),
      ),
    ),
  }

  const WeekProfiles: XMLData = {
    WeekProfile: singlify(
      t.weekProfiles.map(
        (weekProfile, i): XMLData => ({
          WeekName: `${i + 1}`,
          ReferencedDayName: singlify(
            weekProfile.map(
              (dayName, i): XMLData => ({
                '#text': `${dayName}`,
                '@_index': `${i + 1}`,
              }),
            ),
          ),
        }),
      ),
    ),
  }

  const DayProfiles: XMLData = {
    DayProfile: singlify(
      t.dayProfiles.map(
        (dayProfile, i): XMLData => ({
          DayName: `${i + 1}`,
          ProfileSchedule: singlify(
            dayProfile.map((action): XMLData => {
              const d = new Date(action.startTime * 1000)
              return {
                StartTime: `${`00${d.getUTCHours()}`.slice(
                  -2,
                )}:${`00${d.getUTCMinutes()}`.slice(
                  -2,
                )}:${`00${d.getUTCSeconds()}`.slice(-2)}.00Z`,
                [action.mode === 'block'
                  ? 'BlockTariffAction'
                  : 'TOUTariffAction']: `${action.action}`,
              }
            }),
          ),
        }),
      ),
    ),
  }

  const SpecialDay: XMLData[] = t.specialDays.map(
    (specialDay): XMLData => ({
      Date: buildDate(specialDay),
      ReferencedDayName: `${specialDay.dayProfile}`,
    }),
  )

  let SpecialDays: XMLData | '' = ''
  if (SpecialDay.length >= 1) {
    SpecialDays = { SpecialDay: singlify(SpecialDay) }
  }

  const ThresholdMatrix: XMLData = {
    Thresholds: t.blocks.map(
      (block, i): XMLData => ({
        BlockThreshold: singlify(
          block.thresholds.map(
            (threshold, i): XMLData => ({
              '#text': `${threshold}`,
              '@_index': `${i + 1}`,
            }),
          ),
        ),
        '@_index': `${i + 1}`,
      }),
    ),
  }

  const TOUTariff: XMLData = {
    TOUPrice: singlify(
      t.tous
        .map(
          (price, i): XMLData => ({
            '#text': `${price}`,
            '@_index': `${i + 1}`,
          }),
        )
        .filter((x) => x['#text'] !== '0'),
    ),
  }

  const BlockPrices: XMLData[] = t.blocks
    .map(
      (block, i): XMLData => ({
        BlockPrice: singlify(
          block.prices
            .map(
              (price, i): XMLData => ({
                '#text': `${price}`,
                '@_index': `${i + 1}`,
              }),
            )
            .filter((x) => x['#text'] !== '0'),
        ),
        '@_index': `${i + 1}`,
      }),
    )
    .filter((block) =>
      t.dayProfiles.some((dayProfile) =>
        dayProfile.some(
          (profileSchedule) =>
            profileSchedule.mode === 'block' &&
            profileSchedule.action === Number(block['@_index']),
        ),
      ),
    )

  const BlockTariff: XMLData = {
    BlockPrices: BlockPrices.length === 1 ? BlockPrices[0] : BlockPrices,
  }

  const isTOU = t.dayProfiles.some((dayProfile) =>
    dayProfile.some((profileSchedule) => profileSchedule.mode === 'tou'),
  )
  const isBlock = t.dayProfiles.some((dayProfile) =>
    dayProfile.some((profileSchedule) => profileSchedule.mode === 'block'),
  )

  let pricing:
    | { HybridTariff: XMLData }
    | { TOUTariff: XMLData }
    | { BlockTariff: XMLData }
  if (isTOU && isBlock) {
    pricing = { HybridTariff: { ...BlockTariff, ...TOUTariff } }
  } else if (isTOU) {
    pricing = { TOUTariff }
  } else {
    pricing = { BlockTariff }
  }

  return {
    header: {
      type: 'request',
      commandVariant: lookupCV(4),
      serviceReference: '1.1',
      serviceReferenceVariant,
      requestId,
    },
    body: {
      UpdateImportTariffPrimaryElement: {
        ElecTariffElements: {
          CurrencyUnits: 'GBP',
          SwitchingTable: {
            DayProfiles,
            WeekProfiles,
            Seasons,
          },
          SpecialDays,
          ThresholdMatrix,
        },
        PriceElements: {
          ElectricityPriceElements: {
            StandingCharge: `${t.pricing.standingCharge}`,
            StandingChargeScale: `${t.pricing.standingChargeScale}`,
            PriceScale: `${t.pricing.priceScale}`,
            ...pricing,
          },
        },
      },
    },
  }
}
