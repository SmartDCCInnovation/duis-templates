/*
 * Created on Mon Aug 15 2022
 *
 * Copyright (c) 2022 Smart DCC Limited
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

import * as load from '../src/load'
import { resolve } from 'node:path'

describe('parseFileTag', () => {
  test('defined', () => {
    expect(load.parseFileTag).toBeDefined()
  })

  const testData: {
    tag: string
    result: unknown
  }[] = [
    {
      tag: 'GCS36_9.1',
      result: {
        gbcs: 'GCS36',
        gbcsvariant: undefined,
        srv: '9.1',
        variant: undefined,
      },
    },
    {
      tag: 'GCS28Commission_8.1.1',
      result: {
        gbcs: 'GCS28',
        gbcsvariant: 'Commission',
        srv: '8.1.1',
        variant: undefined,
      },
    },
    {
      tag: 'ECS17d_4.1.2_TWIN',
      result: {
        gbcs: 'ECS17d',
        gbcsvariant: undefined,
        srv: '4.1.2',
        variant: 'TWIN',
      },
    },
    {
      tag: 'ECS01b_1.2.1_IMMEDIATE_TOU',
      result: {
        gbcs: 'ECS01b',
        gbcsvariant: undefined,
        srv: '1.2.1',
        variant: 'IMMEDIATE_TOU',
      },
    },
    {
      tag: 'DBCH03_6.30',
      result: {
        gbcs: 'DBCH03',
        gbcsvariant: undefined,
        srv: '6.30',
        variant: undefined,
      },
    },
    {
      tag: 'CS02gLoadControllerBySupplier_6.15.1_CANCELLATION',
      result: {
        gbcs: 'CS02g',
        gbcsvariant: 'LoadControllerBySupplier',
        srv: '6.15.1',
        variant: 'CANCELLATION',
      },
    },
    {
      tag: 'CS02bACBByACB_8.5',
      result: {
        gbcs: 'CS02b',
        gbcsvariant: 'ACBByACB',
        srv: '8.5',
        variant: undefined,
      },
    },
    {
      tag: 'CS03CNonCritical_8.7.2',
      result: {
        gbcs: 'CS03C',
        gbcsvariant: 'NonCritical',
        srv: '8.7.2',
        variant: undefined,
      },
    },
    {
      tag: 'CS04ACCritical_8.8.1',
      result: {
        gbcs: 'CS04AC',
        gbcsvariant: 'Critical',
        srv: '8.8.1',
        variant: undefined,
      },
    },
    {
      tag: '12.2_DEVICE_PRE_NOTIFICATION',
      result: {
        gbcs: undefined,
        gbcsvariant: undefined,
        srv: '12.2',
        variant: 'DEVICE_PRE_NOTIFICATION',
      },
    },
    {
      tag: 'CCS05CCS04_8.9',
      result: {
        gbcs: 'CCS05CCS04',
        gbcsvariant: undefined,
        srv: '8.9',
        variant: undefined,
      },
    },
  ]

  testData.forEach(({ tag, result }) =>
    test(tag, () => expect(load.parseFileTag(tag)?.groups).toEqual(result)),
  )
})

describe('loadTemplate', () => {
  const logger = jest.fn()

  beforeEach(() => {
    logger.mockReset()
  })

  test('defined', () => {
    expect(load.loadTemplate).toBeDefined()
  })

  test('ERROR-request-not-load', async () => {
    await expect(
      load.loadTemplate(
        logger,
        resolve(__dirname, 'data', 'GCS13a_4.1.1_ERROR_REQUEST_DUIS.XML'),
      ),
    ).resolves.toBeNull()
    expect(logger).not.toBeCalled()
  })

  test('ERROR-request-not-load', async () => {
    await expect(
      load.loadTemplate(
        logger,
        resolve(__dirname, 'data', 'GCS13a_4.1.1_ERROR_REQUEST_DUIS.XML'),
      ),
    ).resolves.toBeNull()
    expect(logger).not.toBeCalled()
  })

  test('bad-tag', async () => {
    await expect(
      load.loadTemplate(
        logger,
        resolve(__dirname, 'data', 'SOME_FILE_REQUEST_DUIS.XML'),
      ),
    ).resolves.toBeNull()
    expect(logger).toBeCalledTimes(1)
    expect(logger).toBeCalledWith(
      expect.stringContaining('could not determine tag'),
    )
  })

  test('bad-srv', async () => {
    await expect(
      load.loadTemplate(
        logger,
        resolve(__dirname, 'data', '9.9.9.9.9.9_REQUEST_DUIS.XML'),
      ),
    ).resolves.toBeNull()
    expect(logger).toBeCalledTimes(1)
    expect(logger).toBeCalledWith(expect.stringContaining('srv is unknown'))
  })

  test('non-request', async () => {
    await expect(
      load.loadTemplate(
        logger,
        resolve(__dirname, 'data', 'ECS52_11.2_SUCCESS_RESPONSE_DUIS.XML'),
      ),
    ).resolves.toBeNull()
    expect(logger).toBeCalledTimes(1)
    expect(logger).toBeCalledWith(expect.stringContaining('not a request'))
  })

  test('bad-gbcs-code', async () => {
    await expect(
      load.loadTemplate(
        logger,
        resolve(
          __dirname,
          'data',
          'ECS99b_4.1.1_SINGLE_SUCCESS_REQUEST_DUIS.XML',
        ),
      ),
    ).resolves.toBeNull()
    expect(logger).toBeCalledTimes(1)
    expect(logger).toBeCalledWith(
      expect.stringContaining('gbcs code could not be looked up'),
    )
  })

  test('nominal-non-device', async () => {
    const fileName = resolve(
      __dirname,
      'data',
      '12.2_DEVICE_PRE_NOTIFICATION_REQUEST_DUIS.XML',
    )
    await expect(load.loadTemplate(logger, fileName)).resolves.toEqual([
      '12.2_DEVICE_PRE_NOTIFICATION',
      expect.objectContaining({
        fileName,
        normal: expect.any(Object),
        simplified: expect.objectContaining({
          header: expect.any(Object),
          body: expect.any(Object),
        }),
        serviceReferenceVariant: expect.objectContaining({
          'Service Reference Variant': '12.2',
        }),
        gbcs: undefined,
        gbcsVariant: undefined,
        gbcsTitle: undefined,
        info: 'DEVICE_PRE_NOTIFICATION',
      }),
    ])
    expect(logger).not.toBeCalled()
  })

  test('nominal-device', async () => {
    const fileName = resolve(
      __dirname,
      'data',
      'ECS17b_4.1.1_SINGLE_SUCCESS_REQUEST_DUIS.XML',
    )
    await expect(load.loadTemplate(logger, fileName)).resolves.toEqual([
      'ECS17b_4.1.1_SINGLE',
      expect.objectContaining({
        fileName,
        normal: expect.any(Object),
        simplified: expect.objectContaining({
          header: expect.any(Object),
          body: expect.any(Object),
        }),
        serviceReferenceVariant: expect.objectContaining({
          'Service Reference Variant': '4.1.1',
        }),
        gbcs: 'ECS17b',
        gbcsVariant: undefined,
        gbcsTitle: expect.any(String),
        info: 'SINGLE',
      }),
    ])
    expect(logger).not.toBeCalled()
  })

  test('nominal-device-variant', async () => {
    const fileName = resolve(
      __dirname,
      'data',
      'CS03A2NonCritical_8.7.2_SUCCESS_REQUEST_DUIS.XML',
    )
    await expect(load.loadTemplate(logger, fileName)).resolves.toEqual([
      'CS03A2NonCritical_8.7.2',
      expect.objectContaining({
        fileName,
        normal: expect.any(Object),
        simplified: expect.objectContaining({
          header: expect.any(Object),
          body: expect.any(Object),
        }),
        serviceReferenceVariant: expect.objectContaining({
          'Service Reference Variant': '8.7.2',
        }),
        gbcs: 'CS03A2',
        gbcsVariant: 'NonCritical',
        gbcsTitle: expect.any(String),
        info: undefined,
      }),
    ])
    expect(logger).not.toBeCalled()
  })
})

describe('loadTemplates', () => {
  const logger = jest.fn()

  beforeEach(() => {
    logger.mockReset()
  })

  test('defined', () => {
    expect(load.loadTemplates).toBeDefined()
  })

  test('nominal', async () => {
    await expect(
      load.loadTemplates({
        logger,
        path: resolve(__dirname, 'data'),
      }),
    ).resolves.toEqual({
      '12.2_DEVICE_PRE_NOTIFICATION': expect.any(Object),
      'CS03A2NonCritical_8.7.2': expect.any(Object),
      'ECS17b_4.1.1_SINGLE': expect.any(Object),
      'ECS52_11.2': expect.any(Object),
      'ECS01a_1.1.1_IMMEDIATE_TOU': expect.any(Object),
      'ECS01a_1.1.1_IMMEDIATE_BLOCK': expect.any(Object),
    })
    expect(logger).toHaveBeenCalledTimes(1)
  })

  test('full-load', async () => {
    await expect(load.loadTemplates({})).resolves.toBeInstanceOf(Object)
  })
})

describe('lookupGBCS', () => {
  test('defined', () => {
    expect(load.lookupGBCS).toBeDefined()
  })

  test('invalid-code', () => {
    expect(load.lookupGBCS('asdf')).toBeUndefined()
  })

  test('nominal', () => {
    expect(load.lookupGBCS('ECS17b')).toMatchObject({
      'Use Case Name': 'Read Import Energy / Consumption Registers',
      'Use Case Title': 'ECS17b Read ESME Energy Registers (Import Energy)',
      'Message Type': 'SME.C.NC',
      'Use Case Description':
        'This Use Case is for reading the ESME import energy registers / GSME consumption registers.',
      'Remote Party or HAN Message': 'Remote Party',
      'Service Reference': '4.1',
    })
  })
})
