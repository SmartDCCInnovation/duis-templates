/*
 * Created on Fri Aug 11 2023
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

import type {
  BlockAction,
  Blocks,
  DayProfile,
  DayProfileName,
  DayProfiles,
  NumberRange,
  Pricing,
  ProfileSchedule,
  Season,
  Seasons,
  SpecialDay,
  SpecialDays,
  TOUs,
  Tariff,
  Tuple,
  TupleMinMax,
  WeekProfile,
  WeekProfiles,
} from './tariff.dto'

export function isTuple<T, N extends number, Q extends T[] = []>(
  x: unknown,
  n: N,
  isT: (x: unknown) => x is T,
): x is Tuple<T, N, Q> {
  const y = x as Array<T>
  if (y === null || y === undefined || !Array.isArray(y) || y.length !== n) {
    return false
  }
  return y.every(isT)
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export function isTupleMinMax<
  T,
  Min extends number,
  Max extends number,
  Q extends T[] = Tuple<T, Min>,
>(
  x: unknown,
  min: Min,
  max: Max,
  isT: (x: unknown) => x is T,
): x is TupleMinMax<T, Min, Max, Q> {
  const y = x as Array<T>
  if (
    y === null ||
    y === undefined ||
    !Array.isArray(y) ||
    y.length < min ||
    y.length > max
  ) {
    return false
  }
  return y.every(isT)
}

export function isSeason(x: unknown): x is Season {
  const y = x as Season
  return (
    y !== null &&
    y !== undefined &&
    typeof y === 'object' &&
    typeof y.name === 'string' &&
    typeof y.weekProfile === 'number' &&
    ['undefined', 'number'].includes(typeof y.year) &&
    ['undefined', 'number'].includes(typeof y.month) &&
    ['undefined', 'number'].includes(typeof y.dayOfMonth) &&
    ['undefined', 'number'].includes(typeof y.dayOfWeek)
  )
}

export const isSeasons = (x: unknown): x is Seasons =>
  isTupleMinMax(x, 1, 4, isSeason)

export function isNumberRange<N extends number>(
  x: unknown,
  n: N,
): x is NumberRange<N> {
  return typeof x === 'number' && Number.isInteger(x) && x > 0 && x <= n
}

export function isProfileSchedule(x: unknown): x is ProfileSchedule {
  const y = x as ProfileSchedule
  if (
    y === null ||
    y === undefined ||
    typeof y !== 'object' ||
    !['tou', 'block'].includes(y.mode) ||
    typeof y.startTime !== 'number'
  ) {
    return false
  }

  return (
    (y.mode === 'tou' && isNumberRange(y.action, 48)) ||
    (y.mode === 'block' && isNumberRange(y.action, 8))
  )
}

export const isDayProfile = (x: unknown): x is DayProfile =>
  isTupleMinMax(x, 1, 48, isProfileSchedule)

export const isDayProfiles: (x: unknown) => x is DayProfiles = (
  x,
): x is DayProfiles => isTupleMinMax(x, 1, 16, isDayProfile)

export const isDayProfileName = (x: unknown): x is DayProfileName =>
  isNumberRange(x, 16)

export const isWeekProfile = (x: unknown): x is WeekProfile =>
  isTuple(x, 7, isDayProfileName)

export const isWeekProfiles: (x: unknown) => x is WeekProfiles = (
  x,
): x is WeekProfiles => isTupleMinMax(x, 1, 4, isWeekProfile)

export function isBlockAction(x: unknown): x is BlockAction {
  const y = x as BlockAction
  return (
    y !== null &&
    y !== undefined &&
    typeof y === 'object' &&
    Array.isArray(y.prices) &&
    Array.isArray(y.thresholds) &&
    y.prices.every((p) => typeof p === 'number') &&
    y.thresholds.every((t) => typeof t === 'number') &&
    ((y.thresholds.length === 1 && y.prices.length === 2) ||
      (y.thresholds.length === 2 && y.prices.length === 3) ||
      (y.thresholds.length === 3 && y.prices.length === 4))
  )
}

export const isBlocks = (x: unknown): x is Blocks =>
  isTuple(x, 8, isBlockAction)

export const isTOUs: (x: unknown) => x is TOUs = (x): x is TOUs =>
  isTupleMinMax(x, 0, 48, (n: unknown): n is number => typeof n === 'number')

export function isPricing(x: unknown): x is Pricing {
  const y = x as Pricing
  return (
    y !== null &&
    y !== undefined &&
    typeof y === 'object' &&
    typeof y.priceScale === 'number' &&
    typeof y.standingCharge === 'number' &&
    typeof y.standingChargeScale === 'number'
  )
}

export function isSpecialDay(x: unknown): x is SpecialDay {
  const y = x as SpecialDay
  return (
    y !== null &&
    y !== undefined &&
    typeof y === 'object' &&
    typeof y.dayProfile === 'number' &&
    ['undefined', 'number'].includes(typeof y.year) &&
    ['undefined', 'number'].includes(typeof y.month) &&
    ['undefined', 'number'].includes(typeof y.dayOfMonth) &&
    ['undefined', 'number'].includes(typeof y.dayOfWeek)
  )
}

export const isSpecialDays = (x: unknown): x is SpecialDays =>
  Array.isArray(x) && x.every(isSpecialDay)

export function isTariff(x: unknown): x is Tariff {
  const y = x as Tariff
  return (
    y !== null &&
    y !== undefined &&
    typeof y === 'object' &&
    isSeasons(y.seasons) &&
    isWeekProfiles(y.weekProfiles) &&
    isDayProfiles(y.dayProfiles) &&
    isSpecialDays(y.specialDays) &&
    isBlocks(y.blocks) &&
    isTOUs(y.tous) &&
    isPricing(y.pricing)
  )
}

/**
 * Determine if parameter is a valid tariff. This is a restriction on isTariff
 * by also checking items which are not enforced by the type system.
 *
 * @param x a Tariff object
 */
export function isValidTariff(x: unknown): x is Tariff {
  if (isTariff(x)) {
    /*
      well-formedness check on day profiles:
        each day profile starts at 0
        each day profile start time is monotonic
        largest profile schedule is < full day
    */
    if (
      !x.dayProfiles.every(
        (dp) =>
          dp[0].startTime === 0 &&
          dp.reduce<[boolean, number]>(
            (acc, x) => [
              acc[0] && x.startTime > acc[1] && Number.isInteger(x.startTime),
              x.startTime,
            ],
            [true, -1],
          )[0] &&
          dp[dp.length - 1].startTime < 60 * 60 * 24,
      )
    ) {
      return false
    }

    /*
      well-formedness check on week profiles:
        each week profile only references defined day profiles
    */
    if (
      !x.weekProfiles.every((wp) =>
        wp.every((dpname) => dpname - 1 < x.dayProfiles.length),
      )
    ) {
      return false
    }

    /*
      well-formdness check on seasons:
        each season only references defined week profiles
        each year (if not wildcard) is >= 2014
        each month (if not wildcard) is 1..12
        each day of month (if not wildcard) is 1..31
        each day of week (if not wildcard) is 1..7
    */
    if (
      !x.seasons.every(
        (s) =>
          s.weekProfile - 1 < x.weekProfiles.length &&
          Number.isInteger(s.year ?? 2014) &&
          (s.year ?? 2014) >= 2014 &&
          Number.isInteger(s.month ?? 1) &&
          (s.month ?? 1) >= 1 &&
          (s.month ?? 1) <= 12 &&
          Number.isInteger(s.dayOfMonth ?? 1) &&
          (s.dayOfMonth ?? 1) >= 1 &&
          (s.dayOfMonth ?? 1) <= 31 &&
          Number.isInteger(s.dayOfWeek ?? 1) &&
          (s.dayOfWeek ?? 1) >= 1 &&
          (s.dayOfWeek ?? 1) <= 7 &&
          (s.year === undefined ||
            s.month === undefined ||
            s.dayOfMonth === undefined ||
            s.dayOfWeek === undefined),
      )
    ) {
      return false
    }

    /*
      well-formdness check on special days:
        each special day only references defined day profiles
        each year (if not wildcard) is >= 2014
        each month (if not wildcard) is 1..12
        each day of month (if not wildcard) is 1..31
        each day of week (if not wildcard) is 1..7
    */
    if (
      !x.specialDays.every(
        (sd) =>
          sd.dayProfile - 1 < x.dayProfiles.length &&
          Number.isInteger(sd.year ?? 2014) &&
          (sd.year ?? 2014) >= 2014 &&
          Number.isInteger(sd.month ?? 1) &&
          (sd.month ?? 1) >= 1 &&
          (sd.month ?? 1) <= 12 &&
          Number.isInteger(sd.dayOfMonth ?? 1) &&
          (sd.dayOfMonth ?? 1) >= 1 &&
          (sd.dayOfMonth ?? 1) <= 31 &&
          Number.isInteger(sd.dayOfWeek ?? 1) &&
          (sd.dayOfWeek ?? 1) >= 1 &&
          (sd.dayOfWeek ?? 1) <= 7 &&
          (sd.year === undefined ||
            sd.month === undefined ||
            sd.dayOfMonth === undefined ||
            sd.dayOfWeek === undefined),
      )
    ) {
      return false
    }

    return true
  }
  return false
}
