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

import Fuse from 'fuse.js'
import { Template, TemplateDirectory } from './load'

/**
 * Builds a Fuse searcher instance with some default parameters set.
 * @param td TemplateDirectory to search
 * @param options override default options - avoid setting "keys"
 * @returns Fuse
 */
export function search(
  td: TemplateDirectory,
  options?: Fuse.IFuseOptions<[string, Template]>
): Fuse<[string, Template]> {
  return new Fuse(Object.entries(td), {
    keys: [
      '0',
      '1.serviceReferenceVariant.Service Request Name',
      '1.serviceReferenceVariant.Service Reference Variant',
      '1.gbcs',
      '1.gbcsVariant',
      '1.gbcsTitle',
      '1.info',
    ],
    distance: 200,
    threshold: 0.4,
    includeMatches: true,
    ...options,
  })
}
