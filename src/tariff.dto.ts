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

export type Tuple<
  T,
  N extends number,
  Q extends T[] = [],
> = N extends Q['length'] ? Q : Tuple<T, N, [...Q, T]>

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export type TupleMinMax<
  T,
  Min extends number,
  Max extends number,
  Q extends T[] = Tuple<T, Min>,
> = Max extends Q['length'] ? Q : Q | TupleMinMax<T, Min, Max, [...Q, T]>

export interface Season {
  name: string

  /**
   * 4 digit year, or undefined for wildcard
   */
  year?: number

  /**
   * 1 = jan ... 12 = dec, or undefined for wildcard
   */
  month?: number

  /**
   * 1..31, or undefined for wildcard
   */
  dayOfMonth?: number

  /**
   * 1..7, or undefined for wildcard
   */
  dayOfWeek?: number

  /**
   * 1..4, index week profile
   */
  weekProfile: number
}

export type Seasons = TupleMinMax<Season, 1, 4>

export type NumberRange<
  N extends number,
  Q extends number[] = [1],
> = N extends Q['length']
  ? Q['length']
  : NumberRange<N, [...Q, 1]> | Q['length']

export type ProfileSchedule = {
  /**
   * seconds from 00:00:00 UTC
   */
  startTime: number
} & (
  | { mode: 'tou'; action: NumberRange<48> }
  | { mode: 'block'; action: NumberRange<8> }
)

export type DayProfile = TupleMinMax<ProfileSchedule, 1, 48>

export type DayProfiles = TupleMinMax<DayProfile, 1, 16>

export type DayProfileName = NumberRange<16>

export type WeekProfile = [
  DayProfileName /* monday */,
  DayProfileName /* tuesday */,
  DayProfileName /* wednesday */,
  DayProfileName /* thursday */,
  DayProfileName /* friday */,
  DayProfileName /* saturday */,
  DayProfileName /* sunday */,
]

export type WeekProfiles = TupleMinMax<WeekProfile, 1, 4>

export type BlockAction =
  | {
      thresholds: [number]
      prices: [number, number]
    }
  | {
      thresholds: [number, number]
      prices: [number, number, number]
    }
  | {
      thresholds: [number, number, number]
      prices: [number, number, number, number]
    }

export type Blocks = Tuple<BlockAction, 8>

export type TOUAction = number

export type TOUs = TupleMinMax<TOUAction, 1, 48> | []

export function scheduleSize(dp: DayProfile, ps: ProfileSchedule): number {
  const start = Math.floor(ps.startTime / 1800)
  let end = 48

  const i = dp.indexOf(ps)
  if (i < 0) {
    return 0
  }

  if (dp.length > i + 1) {
    end = Math.floor(dp[i + 1].startTime / 1800)
  }
  return end - start
}

export interface Pricing {
  /**
   * positive integer
   * */
  standingCharge: number

  /**
   * positive integer
   *
   * scale applied to standingCharge, e.g. 0 sets standingCharge to pounds and
   * -2 sets standingCharge to pence.
   *
   * standingCharge * 10^standingChargeScale
   */
  standingChargeScale: number

  /**
   * positive integer
   *
   * scale applied to tou and block tariff elements, e.g. 0 sets to pounds and
   * -2 sets to pence.
   */
  priceScale: number
}

export interface SpecialDay {
  /**
   * 4 digit year, or undefined for wildcard
   */
  year?: number

  /**
   * 1 = jan ... 12 = dec, or undefined for wildcard
   */
  month?: number

  /**
   * 1..31, or undefined for wildcard
   */
  dayOfMonth?: number

  /**
   * 1..7, or undefined for wildcard
   */
  dayOfWeek?: number

  /**
   * 1..16, index day profile
   */
  dayProfile: number
}

/**
 * 0 to 50 SpecialDays
 */
export type SpecialDays = SpecialDay[]

export interface Tariff {
  seasons: Seasons
  weekProfiles: WeekProfiles
  dayProfiles: DayProfiles
  specialDays: SpecialDays
  blocks: Blocks
  tous: TOUs
  pricing: Pricing
}
