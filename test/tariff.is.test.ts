/*
 * Created on Sat Aug 12 2023
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

import { BlockAction, Season, SpecialDay } from '../src/tariff.dto'
import * as t from '../src/tariff.is'

import structuredClone from '@ungap/structured-clone'

const tariff = {
  seasons: [
    {
      name: 'winter',
      year: 2014,
      month: 10,
      dayOfMonth: 27,
      weekProfile: 1,
    } as Season,
    {
      name: 'summer',
      year: 2015,
      month: 3,
      dayOfWeek: 5,
      weekProfile: 2,
    } as Season,
  ],
  weekProfiles: [
    [1, 1, 1, 1, 1, 3, 3],
    [2, 2, 2, 2, 2, 3, 3],
  ],
  dayProfiles: [
    [
      {
        mode: 'tou',
        startTime: 0,
        action: 2,
      },
      {
        mode: 'tou',
        startTime: 7 * 60 * 60,
        action: 3,
      },
    ],
    [
      {
        mode: 'tou',
        startTime: 0,
        action: 3,
      },
      {
        mode: 'tou',
        startTime: 23 * 60 * 60,
        action: 2,
      },
    ],
    [
      {
        mode: 'tou',
        startTime: 0,
        action: 1,
      },
    ],
  ],
  specialDays: [
    { year: 2015, month: 5, dayOfMonth: 1, dayProfile: 2 } as SpecialDay,
    { month: 12, dayOfMonth: 25, dayOfWeek: 3, dayProfile: 3 } as SpecialDay,
  ],
  tous: [2121, 3127, 4744],
  blocks: [
    {
      prices: [0, 0],
      thresholds: [4294967295],
    },
    {
      prices: [0, 0],
      thresholds: [4294967295],
    },
    {
      prices: [0, 0],
      thresholds: [4294967295],
    },
    {
      prices: [0, 0],
      thresholds: [4294967295],
    },
    {
      prices: [0, 0],
      thresholds: [4294967295],
    },
    {
      prices: [0, 0],
      thresholds: [4294967295],
    },
    {
      prices: [0, 0],
      thresholds: [4294967295],
    },
    {
      prices: [0, 0],
      thresholds: [4294967295],
    },
  ],
  pricing: {
    priceScale: -5,
    standingCharge: 20000,
    standingChargeScale: -5,
  },
}

describe('isTuple', () => {
  const isN = (x: unknown): x is number => typeof x === 'number'

  test('defined', () => {
    expect(t.isTuple).toBeDefined()
  })

  test('undefined', () => {
    expect(t.isTuple(undefined, 1, isN)).toBeFalsy()
  })
  test('null', () => {
    expect(t.isTuple(null, 1, isN)).toBeFalsy()
  })
  test('list', () => {
    expect(t.isTuple([], 1, isN)).toBeFalsy()
  })
  test('number', () => {
    expect(t.isTuple(5, 1, isN)).toBeFalsy()
  })
  test('string', () => {
    expect(t.isTuple('', 1, isN)).toBeFalsy()
  })
  test('empty', () => {
    expect(t.isTuple({}, 1, isN)).toBeFalsy()
  })

  test('nominal', () => {
    expect(t.isTuple([1, 2], 2, isN)).toBeTruthy()
  })

  test('empty-tuple', () => {
    expect(t.isTuple([], 0, isN)).toBeTruthy()
  })

  test('wrong-length', () => {
    expect(t.isTuple([1, 2], 3, isN)).toBeFalsy()
  })

  test('wrong-elements', () => {
    expect(t.isTuple([1, false], 2, isN)).toBeFalsy()
  })
})

describe('isTupleMinMax', () => {
  const isN = (x: unknown): x is number => typeof x === 'number'

  test('defined', () => {
    expect(t.isTupleMinMax).toBeDefined()
  })

  test('undefined', () => {
    expect(t.isTupleMinMax(undefined, 1, 2, isN)).toBeFalsy()
  })
  test('null', () => {
    expect(t.isTupleMinMax(null, 1, 2, isN)).toBeFalsy()
  })
  test('list', () => {
    expect(t.isTupleMinMax([], 1, 2, isN)).toBeFalsy()
  })
  test('number', () => {
    expect(t.isTupleMinMax(5, 1, 2, isN)).toBeFalsy()
  })
  test('string', () => {
    expect(t.isTupleMinMax('', 1, 2, isN)).toBeFalsy()
  })
  test('empty', () => {
    expect(t.isTupleMinMax({}, 1, 2, isN)).toBeFalsy()
  })

  /* minimum thorough tests */
  describe('nominal', () => {
    test('0', () => {
      expect(t.isTupleMinMax([], 1, 2, isN)).toBeFalsy()
    })
    test('1', () => {
      expect(t.isTupleMinMax([1], 1, 2, isN)).toBeTruthy()
    })
    test('2', () => {
      expect(t.isTupleMinMax([1, 2], 1, 2, isN)).toBeTruthy()
    })
    test('3', () => {
      expect(t.isTupleMinMax([1, 2, 3], 1, 2, isN)).toBeFalsy()
    })
  })

  test('same-length', () => {
    expect(t.isTupleMinMax([1, 2], 2, 2, isN)).toBeTruthy()
  })

  test('empty-tuple', () => {
    expect(t.isTupleMinMax([], 0, 0, isN)).toBeTruthy()
  })

  test('wrong-length', () => {
    expect(t.isTupleMinMax([1, 2], 3, 4, isN)).toBeFalsy()
  })

  test('wrong-elements', () => {
    expect(t.isTupleMinMax([false], 1, 2, isN)).toBeFalsy()
  })
})

describe('isSeason', () => {
  test('defined', () => {
    expect(t.isSeason).toBeDefined()
  })

  test('undefined', () => {
    expect(t.isSeason(undefined)).toBeFalsy()
  })
  test('null', () => {
    expect(t.isSeason(null)).toBeFalsy()
  })
  test('list', () => {
    expect(t.isSeason([])).toBeFalsy()
  })
  test('number', () => {
    expect(t.isSeason(5)).toBeFalsy()
  })
  test('string', () => {
    expect(t.isSeason('')).toBeFalsy()
  })
  test('empty', () => {
    expect(t.isSeason({})).toBeFalsy()
  })

  test('season-name-only', () => {
    expect(t.isSeason({ name: 'all' })).toBeFalsy()
  })
  test('week-profile-only', () => {
    expect(t.isSeason({ weekProfile: 1 })).toBeFalsy()
  })

  test('nominal-minimal', () => {
    expect(t.isSeason({ name: 'all', weekProfile: 1 })).toBeTruthy()
  })

  test('week-profile-string', () => {
    expect(t.isSeason({ name: 'all', weekProfile: '1' })).toBeFalsy()
  })

  test('season-name-number', () => {
    expect(t.isSeason({ name: 99, weekProfile: 1 })).toBeFalsy()
  })

  describe('optionals', () => {
    ;['year', 'month', 'dayOfMonth', 'dayOfWeek'].forEach((x) => {
      test(`${x}-number`, () => {
        expect(t.isSeason({ name: 'all', weekProfile: 1, [x]: 3 })).toBeTruthy()
      })
      test(`${x}-string`, () => {
        expect(
          t.isSeason({ name: 'all', weekProfile: 1, [x]: '3' }),
        ).toBeFalsy()
      })
    })
  })
})

describe('isSeasons', () => {
  test('defined', () => {
    expect(t.isSeasons).toBeDefined()
  })

  test('undefined', () => {
    expect(t.isSeasons(undefined)).toBeFalsy()
  })
  test('null', () => {
    expect(t.isSeasons(null)).toBeFalsy()
  })
  test('list', () => {
    expect(t.isSeasons([])).toBeFalsy()
  })
  test('number', () => {
    expect(t.isSeasons(5)).toBeFalsy()
  })
  test('string', () => {
    expect(t.isSeasons('')).toBeFalsy()
  })
  test('empty', () => {
    expect(t.isSeasons({})).toBeFalsy()
  })

  test('nominal', () => {
    expect(t.isSeasons([{ name: 'all', weekProfile: 3 }])).toBeTruthy()
  })

  test('max', () => {
    expect(
      t.isSeasons([
        { name: 'all', weekProfile: 3 },
        { name: 'all', weekProfile: 3 },
        { name: 'all', weekProfile: 3 },
        { name: 'all', weekProfile: 3 },
      ]),
    ).toBeTruthy()
  })

  test('too-many', () => {
    expect(
      t.isSeasons([
        { name: 'all', weekProfile: 3 },
        { name: 'all', weekProfile: 3 },
        { name: 'all', weekProfile: 3 },
        { name: 'all', weekProfile: 3 },
        { name: 'all', weekProfile: 3 },
      ]),
    ).toBeFalsy()
  })
})

describe('isNumberRange', () => {
  test('defined', () => {
    expect(t.isNumberRange).toBeDefined()
  })

  test('undefined', () => {
    expect(t.isNumberRange(undefined, 5)).toBeFalsy()
  })
  test('null', () => {
    expect(t.isNumberRange(null, 5)).toBeFalsy()
  })
  test('list', () => {
    expect(t.isNumberRange([], 5)).toBeFalsy()
  })
  test('string', () => {
    expect(t.isNumberRange('', 5)).toBeFalsy()
  })
  test('empty', () => {
    expect(t.isNumberRange({}, 5)).toBeFalsy()
  })

  describe('nominal', () => {
    test('zero', () => {
      expect(t.isNumberRange(0, 5)).toBeFalsy()
    })

    test('non-integer', () => {
      expect(t.isNumberRange(1.1, 5)).toBeFalsy()
    })

    test('low', () => {
      expect(t.isNumberRange(1, 5)).toBeTruthy()
    })

    test('high', () => {
      expect(t.isNumberRange(5, 5)).toBeTruthy()
    })

    test('too large', () => {
      expect(t.isNumberRange(6, 5)).toBeFalsy()
    })
  })
})

describe('isProfileSchedule', () => {
  test('defined', () => {
    expect(t.isProfileSchedule).toBeDefined()
  })

  test('undefined', () => {
    expect(t.isProfileSchedule(undefined)).toBeFalsy()
  })
  test('null', () => {
    expect(t.isProfileSchedule(null)).toBeFalsy()
  })
  test('list', () => {
    expect(t.isProfileSchedule([])).toBeFalsy()
  })
  test('number', () => {
    expect(t.isProfileSchedule(5)).toBeFalsy()
  })
  test('string', () => {
    expect(t.isProfileSchedule('')).toBeFalsy()
  })
  test('empty', () => {
    expect(t.isProfileSchedule({})).toBeFalsy()
  })
  ;[
    { mode: 'tou', max: 48 },
    { mode: 'block', max: 8 },
  ].forEach(({ mode, max }) => {
    describe(mode, () => {
      test('nominal', () => {
        expect(
          t.isProfileSchedule({ mode, startTime: 0, action: 1 }),
        ).toBeTruthy()
      })

      test('zero action', () => {
        expect(
          t.isProfileSchedule({ mode, startTime: 0, action: 0 }),
        ).toBeFalsy()
      })

      test('max action', () => {
        expect(
          t.isProfileSchedule({ mode, startTime: 0, action: max }),
        ).toBeTruthy()
      })

      test('large action', () => {
        expect(
          t.isProfileSchedule({ mode, startTime: 0, action: max + 1 }),
        ).toBeFalsy()
      })

      test('string time', () => {
        expect(
          t.isProfileSchedule({ mode, startTime: '0', action: 1 }),
        ).toBeFalsy()
      })
    })
  })
})

describe('isDayProfile', () => {
  test('defined', () => {
    expect(t.isDayProfile).toBeDefined()
  })

  test('undefined', () => {
    expect(t.isDayProfile(undefined)).toBeFalsy()
  })
  test('null', () => {
    expect(t.isDayProfile(null)).toBeFalsy()
  })
  test('list', () => {
    expect(t.isDayProfile([])).toBeFalsy()
  })
  test('number', () => {
    expect(t.isDayProfile(5)).toBeFalsy()
  })
  test('string', () => {
    expect(t.isDayProfile('')).toBeFalsy()
  })
  test('empty', () => {
    expect(t.isDayProfile({})).toBeFalsy()
  })

  const profileSchedule = { mode: 'tou', startTime: 0, action: 1 }

  test('minimum', () => {
    expect(t.isDayProfile([profileSchedule])).toBeTruthy()
  })

  test('max', () => {
    expect(t.isDayProfile(Array(48).fill(profileSchedule))).toBeTruthy()
  })

  test('too-many', () => {
    expect(t.isDayProfile(Array(49).fill(profileSchedule))).toBeFalsy()
  })
})

describe('isDayProfiles', () => {
  test('defined', () => {
    expect(t.isDayProfiles).toBeDefined()
  })

  test('undefined', () => {
    expect(t.isDayProfiles(undefined)).toBeFalsy()
  })
  test('null', () => {
    expect(t.isDayProfiles(null)).toBeFalsy()
  })
  test('list', () => {
    expect(t.isDayProfiles([])).toBeFalsy()
  })
  test('number', () => {
    expect(t.isDayProfiles(5)).toBeFalsy()
  })
  test('string', () => {
    expect(t.isDayProfiles('')).toBeFalsy()
  })
  test('empty', () => {
    expect(t.isDayProfiles({})).toBeFalsy()
  })

  const profileSchedule = { mode: 'tou', startTime: 0, action: 1 }
  const dayProfile = [profileSchedule]

  test('minimum', () => {
    expect(t.isDayProfiles([dayProfile])).toBeTruthy()
  })

  test('max', () => {
    expect(t.isDayProfiles(Array(16).fill(dayProfile))).toBeTruthy()
  })

  test('too-many', () => {
    expect(t.isDayProfiles(Array(17).fill(dayProfile))).toBeFalsy()
  })
})

describe('isDayProfileName', () => {
  test('defined', () => {
    expect(t.isDayProfileName).toBeDefined()
  })

  test('undefined', () => {
    expect(t.isDayProfileName(undefined)).toBeFalsy()
  })
  test('null', () => {
    expect(t.isDayProfileName(null)).toBeFalsy()
  })
  test('list', () => {
    expect(t.isDayProfileName([])).toBeFalsy()
  })
  test('string', () => {
    expect(t.isDayProfileName('')).toBeFalsy()
  })
  test('empty', () => {
    expect(t.isDayProfileName({})).toBeFalsy()
  })

  describe('nominal', () => {
    test('zero', () => {
      expect(t.isDayProfileName(0)).toBeFalsy()
    })

    test('non-integer', () => {
      expect(t.isDayProfileName(1.1)).toBeFalsy()
    })

    const valid = Array.from(Array(16).keys()).map((n) => n + 1)

    valid.forEach((i) => {
      test(`${i}`, () => {
        expect(t.isDayProfileName(i)).toBeTruthy()
      })
    })

    test('too large', () => {
      expect(t.isDayProfileName(valid.length + 1)).toBeFalsy()
    })
  })
})

describe('isWeekProfile', () => {
  test('defined', () => {
    expect(t.isWeekProfile).toBeDefined()
  })

  test('undefined', () => {
    expect(t.isWeekProfile(undefined)).toBeFalsy()
  })
  test('null', () => {
    expect(t.isWeekProfile(null)).toBeFalsy()
  })
  test('list', () => {
    expect(t.isWeekProfile([])).toBeFalsy()
  })
  test('number', () => {
    expect(t.isWeekProfile(5)).toBeFalsy()
  })
  test('string', () => {
    expect(t.isWeekProfile('')).toBeFalsy()
  })
  test('empty', () => {
    expect(t.isWeekProfile({})).toBeFalsy()
  })

  test('nominal', () => {
    expect(t.isWeekProfile([1, 2, 3, 4, 5, 6, 7])).toBeTruthy()
  })

  test('too-short', () => {
    expect(t.isDayProfiles([1, 2, 3, 4, 5, 6])).toBeFalsy()
  })

  test('too-many', () => {
    expect(t.isDayProfiles([1, 2, 3, 4, 5, 6, 7, 8])).toBeFalsy()
  })

  test('non-numeric', () => {
    expect(t.isWeekProfile([1, 2, '3', 4, 5, 6, 7])).toBeFalsy()
  })
})

describe('isWeekProfiles', () => {
  test('defined', () => {
    expect(t.isWeekProfiles).toBeDefined()
  })

  test('undefined', () => {
    expect(t.isWeekProfiles(undefined)).toBeFalsy()
  })
  test('null', () => {
    expect(t.isWeekProfiles(null)).toBeFalsy()
  })
  test('list', () => {
    expect(t.isWeekProfiles([])).toBeFalsy()
  })
  test('number', () => {
    expect(t.isWeekProfiles(5)).toBeFalsy()
  })
  test('string', () => {
    expect(t.isWeekProfiles('')).toBeFalsy()
  })
  test('empty', () => {
    expect(t.isWeekProfiles({})).toBeFalsy()
  })

  const weekProfile = [1, 2, 3, 4, 5, 6, 7]

  test('minimum', () => {
    expect(t.isWeekProfiles([weekProfile])).toBeTruthy()
  })

  test('max', () => {
    expect(t.isWeekProfiles(Array(4).fill(weekProfile))).toBeTruthy()
  })

  test('too-many', () => {
    expect(t.isWeekProfiles(Array(5).fill(weekProfile))).toBeFalsy()
  })
})

describe('isBlockAction', () => {
  test('defined', () => {
    expect(t.isBlockAction).toBeDefined()
  })

  test('undefined', () => {
    expect(t.isBlockAction(undefined)).toBeFalsy()
  })
  test('null', () => {
    expect(t.isBlockAction(null)).toBeFalsy()
  })
  test('list', () => {
    expect(t.isBlockAction([])).toBeFalsy()
  })
  test('number', () => {
    expect(t.isBlockAction(5)).toBeFalsy()
  })
  test('string', () => {
    expect(t.isBlockAction('')).toBeFalsy()
  })
  test('empty', () => {
    expect(t.isBlockAction({})).toBeFalsy()
  })

  describe('nested-init', () => {
    ;['prices', 'thresholds'].forEach((s) => {
      describe(s, () => {
        test('undefined', () => {
          expect(t.isBlockAction({ [s]: undefined })).toBeFalsy()
        })
        test('null', () => {
          expect(t.isBlockAction({ [s]: null })).toBeFalsy()
        })
        test('list', () => {
          expect(t.isBlockAction({ [s]: [] })).toBeFalsy()
        })
        test('number', () => {
          expect(t.isBlockAction({ [s]: 5 })).toBeFalsy()
        })
        test('string', () => {
          expect(t.isBlockAction({ [s]: '' })).toBeFalsy()
        })
        test('empty', () => {
          expect(t.isBlockAction({ [s]: {} })).toBeFalsy()
        })
      })
    })

    describe('pair', () => {
      test('undefined', () => {
        expect(
          t.isBlockAction({ prices: undefined, thresholds: undefined }),
        ).toBeFalsy()
      })
      test('null', () => {
        expect(t.isBlockAction({ prices: null, thresholds: null })).toBeFalsy()
      })
      test('list', () => {
        expect(t.isBlockAction({ prices: [], thresholds: [] })).toBeFalsy()
      })
      test('number', () => {
        expect(t.isBlockAction({ prices: 5, thresholds: 5 })).toBeFalsy()
      })
      test('string', () => {
        expect(t.isBlockAction({ prices: '', thresholds: '' })).toBeFalsy()
      })
      test('empty', () => {
        expect(t.isBlockAction({ pricing: {}, thresholds: {} })).toBeFalsy()
      })
    })
  })

  describe('nominal', () => {
    ;[...Array(5).keys()]
      .map((p) =>
        [...Array(5).keys()].map((th) => ({
          p,
          th,
          r: p >= 2 && p <= 4 && th === p - 1,
        })),
      )
      .flat()
      .forEach(({ p, th, r }) => {
        test(`${p}-${th}-${r}`, () => {
          expect(
            t.isBlockAction({
              prices: Array<number>(p).fill(0),
              thresholds: Array<number>(th).fill(0),
            }),
          ).toBe(r)
        })
      })
  })
})

describe('isBlocks', () => {
  test('defined', () => {
    expect(t.isBlocks).toBeDefined()
  })

  test('undefined', () => {
    expect(t.isBlocks(undefined)).toBeFalsy()
  })
  test('null', () => {
    expect(t.isBlocks(null)).toBeFalsy()
  })
  test('list', () => {
    expect(t.isBlocks([])).toBeFalsy()
  })
  test('number', () => {
    expect(t.isBlocks(5)).toBeFalsy()
  })
  test('string', () => {
    expect(t.isBlocks('')).toBeFalsy()
  })
  test('empty', () => {
    expect(t.isBlocks({})).toBeFalsy()
  })

  const ba: BlockAction = {
    prices: [0, 0],
    thresholds: [0],
  }

  test('nominal', () => {
    expect(t.isBlocks([ba, ba, ba, ba, ba, ba, ba, ba])).toBeTruthy()
  })

  test('too-short', () => {
    expect(t.isBlocks([ba, ba, ba, ba, ba, ba, ba])).toBeFalsy()
  })

  test('too-many', () => {
    expect(t.isBlocks([ba, ba, ba, ba, ba, ba, ba, ba, ba])).toBeFalsy()
  })

  test('non-block-action', () => {
    expect(t.isBlocks([ba, ba, 3, ba, ba, ba, ba, ba])).toBeFalsy()
  })
})

describe('isTOUs', () => {
  test('defined', () => {
    expect(t.isTOUs).toBeDefined()
  })

  test('undefined', () => {
    expect(t.isTOUs(undefined)).toBeFalsy()
  })
  test('null', () => {
    expect(t.isTOUs(null)).toBeFalsy()
  })
  test('number', () => {
    expect(t.isTOUs(5)).toBeFalsy()
  })
  test('string', () => {
    expect(t.isTOUs('')).toBeFalsy()
  })
  test('empty', () => {
    expect(t.isTOUs({})).toBeFalsy()
  })

  test('minimum', () => {
    expect(t.isTOUs([])).toBeTruthy()
  })

  test('one', () => {
    expect(t.isTOUs(Array(1).fill(0))).toBeTruthy()
  })

  test('max', () => {
    expect(t.isTOUs(Array(48).fill(0))).toBeTruthy()
  })

  test('too-many', () => {
    expect(t.isTOUs(Array(49).fill(0))).toBeFalsy()
  })
})

describe('isPricing', () => {
  test('defined', () => {
    expect(t.isPricing).toBeDefined()
  })

  test('undefined', () => {
    expect(t.isPricing(undefined)).toBeFalsy()
  })
  test('null', () => {
    expect(t.isPricing(null)).toBeFalsy()
  })
  test('list', () => {
    expect(t.isPricing([])).toBeFalsy()
  })
  test('number', () => {
    expect(t.isPricing(5)).toBeFalsy()
  })
  test('string', () => {
    expect(t.isPricing('')).toBeFalsy()
  })
  test('empty', () => {
    expect(t.isPricing({})).toBeFalsy()
  })

  const nominal = {
    standingCharge: 0,
    standingChargeScale: 0,
    priceScale: 0,
  }

  test('nominal', () => {
    expect(t.isPricing(nominal)).toBeTruthy()
  })

  test('wrong-standingCharge', () => {
    expect(t.isPricing({ ...nominal, standingCharge: true })).toBeFalsy()
  })

  test('wrong-standingChargeScale', () => {
    expect(t.isPricing({ ...nominal, standingChargeScale: 'true' })).toBeFalsy()
  })

  test('wrong-priceScale', () => {
    expect(t.isPricing({ ...nominal, priceScale: {} })).toBeFalsy()
  })
})

describe('isSpecialDay', () => {
  test('defined', () => {
    expect(t.isSpecialDay).toBeDefined()
  })

  test('undefined', () => {
    expect(t.isSpecialDay(undefined)).toBeFalsy()
  })
  test('null', () => {
    expect(t.isSpecialDay(null)).toBeFalsy()
  })
  test('list', () => {
    expect(t.isSpecialDay([])).toBeFalsy()
  })
  test('number', () => {
    expect(t.isSpecialDay(5)).toBeFalsy()
  })
  test('string', () => {
    expect(t.isSpecialDay('')).toBeFalsy()
  })
  test('empty', () => {
    expect(t.isSpecialDay({})).toBeFalsy()
  })

  test('day-profile-only', () => {
    expect(t.isSpecialDay({ dayProfile: 1 })).toBeTruthy()
  })

  test('day-profile-string', () => {
    expect(t.isSpecialDay({ dayProfile: '1' })).toBeFalsy()
  })

  describe('optionals', () => {
    ;['year', 'month', 'dayOfMonth', 'dayOfWeek'].forEach((x) => {
      test(`${x}-number`, () => {
        expect(t.isSpecialDay({ dayProfile: 1, [x]: 3 })).toBeTruthy()
      })
      test(`${x}-string`, () => {
        expect(t.isSpecialDay({ dayProfile: 1, [x]: '3' })).toBeFalsy()
      })
    })
  })
})

describe('isSpecialDays', () => {
  test('defined', () => {
    expect(t.isSpecialDays).toBeDefined()
  })

  test('undefined', () => {
    expect(t.isSpecialDays(undefined)).toBeFalsy()
  })
  test('null', () => {
    expect(t.isSpecialDays(null)).toBeFalsy()
  })
  test('number', () => {
    expect(t.isSpecialDays(5)).toBeFalsy()
  })
  test('string', () => {
    expect(t.isSpecialDays('')).toBeFalsy()
  })
  test('empty', () => {
    expect(t.isSpecialDays({})).toBeFalsy()
  })

  test('minimum', () => {
    expect(t.isSpecialDays([])).toBeTruthy()
  })

  const sp: SpecialDay = {
    dayProfile: 2,
  }

  test('one', () => {
    expect(t.isSpecialDays(Array(1).fill(sp))).toBeTruthy()
  })

  test('max', () => {
    expect(t.isSpecialDays(Array(50).fill(sp))).toBeTruthy()
  })
})

describe('isTariff', () => {
  test('defined', () => {
    expect(t.isTariff).toBeDefined()
  })

  test('undefined', () => {
    expect(t.isTariff(undefined)).toBeFalsy()
  })
  test('null', () => {
    expect(t.isTariff(null)).toBeFalsy()
  })
  test('list', () => {
    expect(t.isTariff([])).toBeFalsy()
  })
  test('number', () => {
    expect(t.isTariff(5)).toBeFalsy()
  })
  test('string', () => {
    expect(t.isTariff('')).toBeFalsy()
  })
  test('empty', () => {
    expect(t.isTariff({})).toBeFalsy()
  })

  test('nominal', () => {
    expect(t.isTariff(tariff)).toBeTruthy()
  })
})

describe('isValidTariff', () => {
  test('defined', () => {
    expect(t.isValidTariff).toBeDefined()
  })

  test('undefined', () => {
    expect(t.isValidTariff(undefined)).toBeFalsy()
  })
  test('null', () => {
    expect(t.isValidTariff(null)).toBeFalsy()
  })
  test('list', () => {
    expect(t.isValidTariff([])).toBeFalsy()
  })
  test('number', () => {
    expect(t.isValidTariff(5)).toBeFalsy()
  })
  test('string', () => {
    expect(t.isValidTariff('')).toBeFalsy()
  })
  test('empty', () => {
    expect(t.isValidTariff({})).toBeFalsy()
  })

  test('nominal', () => {
    const x = structuredClone(tariff)
    expect(t.isValidTariff(x)).toBeTruthy()
  })

  test('day-profile-start-non-zero', () => {
    const x = structuredClone(tariff)
    x.dayProfiles[0][0].startTime = 1
    expect(t.isTariff(x)).toBeTruthy()
    expect(t.isValidTariff(x)).toBeFalsy()
  })

  test('day-profile-non-monotonic', () => {
    const x = structuredClone(tariff)
    x.dayProfiles[0][1].startTime = 0
    expect(t.isTariff(x)).toBeTruthy()
    expect(t.isValidTariff(x)).toBeFalsy()
  })

  test('day-profile-start-larger-24h', () => {
    const x = structuredClone(tariff)
    x.dayProfiles[0][1].startTime = 60 * 60 * 25
    expect(t.isTariff(x)).toBeTruthy()
    expect(t.isValidTariff(x)).toBeFalsy()
  })

  test('week-profile-with-invalid-day-profile', () => {
    const x = structuredClone(tariff)
    x.weekProfiles[0][5] = 5
    expect(t.isTariff(x)).toBeTruthy()
    expect(t.isValidTariff(x)).toBeFalsy()
  })

  test('season-with-invalid-week-profile', () => {
    const x = structuredClone(tariff)
    x.seasons[0].weekProfile = 3
    expect(t.isTariff(x)).toBeTruthy()
    expect(t.isValidTariff(x)).toBeFalsy()
  })

  test('season-with-wildcard-year', () => {
    const x = structuredClone(tariff)
    delete x.seasons[0].year
    expect(t.isTariff(x)).toBeTruthy()
    expect(t.isValidTariff(x)).toBeTruthy()
  })

  test('season-with-year-before-2014', () => {
    const x = structuredClone(tariff)
    x.seasons[0].year = 2000
    expect(t.isTariff(x)).toBeTruthy()
    expect(t.isValidTariff(x)).toBeFalsy()
  })

  test('season-with-invalid-month', () => {
    const x = structuredClone(tariff)
    x.seasons[0].month = 13
    expect(t.isTariff(x)).toBeTruthy()
    expect(t.isValidTariff(x)).toBeFalsy()
  })

  test('season-with-wildcard-month', () => {
    const x = structuredClone(tariff)
    delete x.seasons[0].month
    expect(t.isTariff(x)).toBeTruthy()
    expect(t.isValidTariff(x)).toBeTruthy()
  })

  test('season-with-invalid-day-of-month', () => {
    const x = structuredClone(tariff)
    x.seasons[0].dayOfMonth = 32
    expect(t.isTariff(x)).toBeTruthy()
    expect(t.isValidTariff(x)).toBeFalsy()
  })

  test('season-with-invalid-day-of-week', () => {
    const x = structuredClone(tariff)
    x.seasons[1].dayOfWeek = 8
    expect(t.isTariff(x)).toBeTruthy()
    expect(t.isValidTariff(x)).toBeFalsy()
  })

  test('season-with-overspecified-date', () => {
    const x = structuredClone(tariff)
    x.seasons[0].dayOfWeek = 6
    expect(t.isTariff(x)).toBeTruthy()
    expect(t.isValidTariff(x)).toBeFalsy()
  })

  test('special-day-with-invalid-day-profile', () => {
    const x = structuredClone(tariff)
    x.specialDays[0].dayProfile = 4
    expect(t.isTariff(x)).toBeTruthy()
    expect(t.isValidTariff(x)).toBeFalsy()
  })

  test('special-day-with-year-before-2014', () => {
    const x = structuredClone(tariff)
    x.specialDays[0].year = 2000
    expect(t.isTariff(x)).toBeTruthy()
    expect(t.isValidTariff(x)).toBeFalsy()
  })

  test('special-day-with-invalid-month', () => {
    const x = structuredClone(tariff)
    x.specialDays[0].month = 13
    expect(t.isTariff(x)).toBeTruthy()
    expect(t.isValidTariff(x)).toBeFalsy()
  })

  test('special-day-with-wildcard-month', () => {
    const x = structuredClone(tariff)
    delete x.specialDays[0].month
    expect(t.isTariff(x)).toBeTruthy()
    expect(t.isValidTariff(x)).toBeTruthy()
  })

  test('special-day-with-invalid-day-of-month', () => {
    const x = structuredClone(tariff)
    x.specialDays[0].dayOfMonth = 32
    expect(t.isTariff(x)).toBeTruthy()
    expect(t.isValidTariff(x)).toBeFalsy()
  })

  test('special-day-with-wildcard-day-of-month', () => {
    const x = structuredClone(tariff)
    delete x.specialDays[0].dayOfMonth
    expect(t.isTariff(x)).toBeTruthy()
    expect(t.isValidTariff(x)).toBeTruthy()
  })

  test('special-day-with-invalid-day-of-week', () => {
    const x = structuredClone(tariff)
    x.specialDays[1].dayOfWeek = 8
    expect(t.isTariff(x)).toBeTruthy()
    expect(t.isValidTariff(x)).toBeFalsy()
  })

  test('special-day-with-wildcard-day-of-week', () => {
    const x = structuredClone(tariff)
    delete x.specialDays[1].dayOfWeek
    expect(t.isTariff(x)).toBeTruthy()
    expect(t.isValidTariff(x)).toBeTruthy()
  })

  test('special-day-with-overspecified-date', () => {
    const x = structuredClone(tariff)
    x.specialDays[0].dayOfWeek = 6
    expect(t.isTariff(x)).toBeTruthy()
    expect(t.isValidTariff(x)).toBeFalsy()
  })
})
