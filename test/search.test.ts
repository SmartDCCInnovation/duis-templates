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
import * as search from '../src/search'
import { resolve } from 'node:path'
import Fuse from 'fuse.js'

describe('search', () => {
  const td = load.loadTemplates({ path: resolve(__dirname, 'data') })

  test('defined', () => {
    expect(search.search).toBeDefined()
  })

  test('empty', () => {
    expect(search.search({})).toBeInstanceOf(Fuse)
  })

  test('nominal', async () => {
    expect(search.search(await td)).toBeInstanceOf(Fuse)
  })

  test('search-basic', async () => {
    const fuse = search.search(await td)
    const results = fuse.search('12.2')
    expect(results.length).toBeGreaterThan(1)
    expect(results[0].item).toMatchObject([
      '12.2_DEVICE_PRE_NOTIFICATION',
      (await td)['12.2_DEVICE_PRE_NOTIFICATION'],
    ])
    expect(results[0].matches).toBeDefined()
  })
})

describe('searchGBCS', () => {
  test('defined', () => {
    expect(search.searchGBCS).toBeDefined()
  })

  test('nominal', async () => {
    expect(search.searchGBCS()).toBeInstanceOf(Fuse)
  })

  test('search-basic', async () => {
    const fuse = search.searchGBCS()
    const results = fuse.search('ECS17b')
    expect(results.length).toBeGreaterThan(1)
    expect(results[0].item).toMatchObject(['ECS17b', expect.any(Object)])
    expect(results[0].matches).toBeDefined()
  })
})
