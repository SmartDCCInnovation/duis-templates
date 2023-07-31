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

import { XMLData, constructDuis } from '@smartdcc/duis-parser'
import * as tariff from '../src/tariff'
import * as load from '../src/load'
import { Tariff } from '../src/tariff.dto'
import { signDuis, validateDuis } from '@smartdcc/duis-sign-wrap'

const touTariff: Tariff = {
  seasons: [
    {
      name: 'winter',
      year: 2014,
      month: 10,
      dayOfMonth: 27,
      weekProfile: 1,
    },
    {
      name: 'summer',
      year: 2015,
      month: 3,
      dayOfMonth: 29,
      weekProfile: 2,
    },
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
    { year: 2015, month: 5, dayOfMonth: 1, dayProfile: 2 },
    { month: 12, dayOfMonth: 25, dayProfile: 3 },
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

const blockTariff: Tariff = {
  seasons: [
    {
      name: 'all',
      year: 2015,
      month: 1,
      dayOfMonth: 1,
      weekProfile: 1,
    },
  ],
  weekProfiles: [[1, 1, 1, 1, 1, 1, 1]],
  dayProfiles: [
    [
      {
        mode: 'block',
        startTime: 0,
        action: 1,
      },
    ],
  ],
  specialDays: [],
  tous: [],
  blocks: [
    {
      prices: [1361, 2289, 5566, 0],
      thresholds: [10000, 20000, 4294967295],
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

const hybridTariff_simple: Tariff = {
  seasons: [
    {
      name: 'ALL',
      weekProfile: 1,
    },
  ],
  weekProfiles: [[1, 1, 1, 1, 1, 1, 1]],
  dayProfiles: [
    [
      {
        startTime: 0,
        mode: 'tou',
        action: 1,
      },
      {
        startTime: 18000,
        mode: 'tou',
        action: 2,
      },
      {
        startTime: 28800,
        mode: 'tou',
        action: 1,
      },
      {
        startTime: 59400,
        mode: 'tou',
        action: 2,
      },
      {
        startTime: 73800,
        mode: 'tou',
        action: 1,
      },
    ],
    [
      {
        startTime: 0,
        mode: 'block',
        action: 1,
      },
    ],
  ],
  specialDays: [
    {
      dayProfile: 2,
      dayOfWeek: 7,
    },
  ],
  blocks: [
    {
      thresholds: [20],
      prices: [50, 10],
    },
    {
      thresholds: [0],
      prices: [0, 0],
    },
    {
      thresholds: [0],
      prices: [0, 0],
    },
    {
      thresholds: [0],
      prices: [0, 0],
    },
    {
      thresholds: [0],
      prices: [0, 0],
    },
    {
      thresholds: [0],
      prices: [0, 0],
    },
    {
      thresholds: [0],
      prices: [1, 2],
    },
    {
      thresholds: [0],
      prices: [1, 2],
    },
  ],
  tous: [
    35, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ],
  pricing: {
    priceScale: -2,
    standingCharge: 10,
    standingChargeScale: -2,
  },
}

const hybridTariff_complex: Tariff = {
  seasons: [
    {
      name: 'Spring',
      weekProfile: 1,
      dayOfWeek: 1,
      month: 3,
    },
    {
      name: 'Summer',
      weekProfile: 2,
      dayOfWeek: 1,
      month: 5,
    },
  ],
  weekProfiles: [
    [1, 1, 1, 1, 1, 2, 2],
    [3, 3, 3, 3, 3, 2, 2],
  ],
  dayProfiles: [
    [
      {
        startTime: 0,
        mode: 'tou',
        action: 2,
      },
      {
        startTime: 18000,
        mode: 'block',
        action: 1,
      },
      {
        startTime: 25200,
        mode: 'tou',
        action: 2,
      },
      {
        startTime: 61200,
        mode: 'block',
        action: 1,
      },
      {
        startTime: 68400,
        mode: 'tou',
        action: 3,
      },
    ],
    [
      {
        startTime: 0,
        mode: 'tou',
        action: 1,
      },
    ],
    [
      {
        startTime: 0,
        mode: 'tou',
        action: 5,
      },
      {
        startTime: 23400,
        mode: 'tou',
        action: 4,
      },
      {
        startTime: 64800,
        mode: 'tou',
        action: 5,
      },
    ],
  ],
  specialDays: [],
  blocks: [
    {
      thresholds: [2, 4, 8],
      prices: [35, 200, 350, 450],
    },
    {
      thresholds: [0],
      prices: [0, 0],
    },
    {
      thresholds: [0],
      prices: [0, 0],
    },
    {
      thresholds: [0],
      prices: [0, 0],
    },
    {
      thresholds: [0],
      prices: [0, 0],
    },
    {
      thresholds: [0],
      prices: [0, 0],
    },
    {
      thresholds: [0],
      prices: [0, 0],
    },
    {
      thresholds: [0],
      prices: [0, 0],
    },
  ],
  tous: [
    200, 35, 54, 20, 78, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ],
  pricing: {
    priceScale: -2,
    standingCharge: 10,
    standingChargeScale: -2,
  },
}

const simpleToUTariff: Tariff = {
  seasons: [
    {
      name: 'all',
      weekProfile: 1
    },
  ],
  weekProfiles: [[1, 1, 1, 1, 1, 1, 1]],
  dayProfiles: [
    [
      {
        mode: 'tou',
        startTime: 0,
        action: 1,
      },
    ],
  ],
  specialDays: [],
  tous: [20],
  blocks: [
    {
      prices: [0, 0],
      thresholds: [ 0],
    },
    {
      prices: [0, 0],
      thresholds: [0],
    },
    {
      prices: [0, 0],
      thresholds: [0],
    },
    {
      prices: [0, 0],
      thresholds: [0],
    },
    {
      prices: [0, 0],
      thresholds: [0],
    },
    {
      prices: [0, 0],
      thresholds: [0],
    },
    {
      prices: [0, 0],
      thresholds: [0],
    },
    {
      prices: [0, 0],
      thresholds: [0],
    },
  ],
  pricing: {
    priceScale: -2,
    standingCharge: 55,
    standingChargeScale: -2,
  },
}

describe('singlify', () => {
  test('defined', () => {
    expect(tariff.singlify).toBeDefined()
  })

  test('empty', () => {
    expect(tariff.singlify([])).toStrictEqual([])
  })

  test('single', () => {
    const x: XMLData = {}
    expect(tariff.singlify([x])).toBe(x)
  })

  test('multiple', () => {
    const x: XMLData = {}
    const y: XMLData = {}
    const list = [x, y]
    expect(tariff.singlify(list)).toBe(list)
  })
})

describe('buildUpdateImportTariff_PrimaryElement', () => {
  test('defined', () => {
    expect(tariff.buildUpdateImportTariff_PrimaryElement).toBeDefined()
  })

  describe('tou', () => {
    const requestId = {
      counter: BigInt(1006),
      originatorId: '90-b3-d5-1f-30-01-00-00',
      targetId: '00-db-12-34-56-78-90-a0',
    }
    const t = touTariff
    test('rtds', async () => {
      const template = await load.loadTemplate(() => {
        /**/
      }, './test/data/ECS01a_1.1.1_IMMEDIATE_TOU_SUCCESS_REQUEST_DUIS.XML')
      expect(template).toBeTruthy()
      expect(
        tariff.buildUpdateImportTariff_PrimaryElement(t, requestId),
      ).toMatchObject((template as [string, load.Template])[1].simplified)
    })

    test('valid', async () => {
      const req = tariff.buildUpdateImportTariff_PrimaryElement(t, requestId)
      await expect(
        signDuis({ xml: constructDuis('simplified', req) }),
      ).resolves.toBeTruthy()
    })

    test('valid-simple', async () => {
      const req = tariff.buildUpdateImportTariff_PrimaryElement(
        simpleToUTariff,
        requestId,
      )
      const xml = constructDuis('simplified', req)
      await expect(signDuis({ xml })).resolves.toBeTruthy()
    })
  })

  describe('block', () => {
    const requestId = {
      counter: BigInt(1007),
      originatorId: '90-b3-d5-1f-30-01-00-00',
      targetId: '00-db-12-34-56-78-90-a0',
    }
    const t = blockTariff
    test('rtds', async () => {
      const template = await load.loadTemplate(() => {
        /**/
      }, './test/data/ECS01a_1.1.1_IMMEDIATE_BLOCK_SUCCESS_REQUEST_DUIS.XML')
      expect(template).toBeTruthy()
      expect(
        tariff.buildUpdateImportTariff_PrimaryElement(t, requestId),
      ).toMatchObject((template as [string, load.Template])[1].simplified)
    })

    test('valid', async () => {
      const req = tariff.buildUpdateImportTariff_PrimaryElement(t, requestId)
      await expect(
        signDuis({ xml: constructDuis('simplified', req) }),
      ).resolves.toBeTruthy()
    })
  })

  describe('hybrid', () => {
    const requestId = {
      counter: BigInt(1008),
      originatorId: '90-b3-d5-1f-30-01-00-00',
      targetId: '00-db-12-34-56-78-90-a0',
    }

    test('valid-simple', async () => {
      const req = tariff.buildUpdateImportTariff_PrimaryElement(
        hybridTariff_simple,
        requestId,
      )
      const xml = constructDuis('simplified', req)
      await expect(signDuis({ xml })).resolves.toBeTruthy()
    })

    test('valid-complex', async () => {
      const req = tariff.buildUpdateImportTariff_PrimaryElement(
        hybridTariff_complex,
        requestId,
      )
      const xml = constructDuis('simplified', req)
      await expect(signDuis({ xml })).resolves.toBeTruthy()
    })
  })
})
