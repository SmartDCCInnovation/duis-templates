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

import {
  parseDuis,
  XMLData,
  SimplifiedDuisOutputRequest,
  ServiceReferenceVariant,
  lookupSRV,
  isSimplifiedDuisOutputRequest,
} from '@smartdcc/duis-parser'
import glob from 'glob'
import { basename, resolve } from 'node:path'
import { readFile } from 'node:fs/promises'
import mappingTable from './gbcs-mapping-table.json'

export interface Template {
  fileName: string
  normal: XMLData
  simplified: SimplifiedDuisOutputRequest
  serviceReferenceVariant: ServiceReferenceVariant
  gbcs?: string
  gbcsVariant?: string
  gbcsTitle?: string
  info?: string
}

export function parseFileTag(tag: string): RegExpMatchArray | null {
  return tag.match(
    /(?:(?<gbcs>[A-Z]+\d+(?:(?:[a-z]|[A-Z]{1,2})\d?)?|CCS05CCS04)(?<gbcsvariant>(?:[A-Z][a-z]+|NO|ACB|MAC|S)+)?_)?(?<srv>\d+(?:\.\d+)+)(?:_(?<variant>[A-Za-z_]*))?/
  )
}

export async function loadTemplate(
  logger: (msg: string) => void,
  fileName: string
): Promise<[string, Template] | null> {
  let tag = basename(fileName, '_REQUEST_DUIS.XML')
  if (tag.search(/_(ERROR|NOT_FOUND)/) >= 0) {
    return null
  }
  tag = tag.replace(/_SUCCESS/, '')
  const groups = parseFileTag(tag)
  if (groups === null) {
    logger(`not loading duis template ${fileName} as could not determine tag`)
    return null
  }
  const serviceReferenceVariant = lookupSRV(groups.groups?.['srv'] ?? '')
  if (!serviceReferenceVariant) {
    logger(
      `not loading duis template ${fileName} as srv is unknown ${groups.groups?.['srv']}`
    )
    return null
  }
  let gbcsTitle: string | undefined = undefined
  if (groups.groups?.['gbcs']) {
    const gbcsRecord = mappingTable.find(
      (e) => e.Code === groups.groups?.['gbcs']
    )
    if (gbcsRecord) {
      gbcsTitle = gbcsRecord['Use Case Title']
    } else {
      logger(
        `not loading duis template ${fileName} as gbcs code could not be looked up`
      )
      return null
    }
  }
  const template_buffer = await readFile(fileName)
  const simplified = parseDuis('simplified', template_buffer)
  if (!isSimplifiedDuisOutputRequest(simplified)) {
    logger(`not loading duis template ${fileName} its not a request`)
    return null
  }
  return [
    tag,
    {
      fileName,
      normal: parseDuis('normal', template_buffer),
      simplified: simplified as SimplifiedDuisOutputRequest,
      serviceReferenceVariant,
      gbcs: groups.groups?.['gbcs'] ?? undefined,
      gbcsVariant: groups.groups?.['gbcsvariant'] ?? undefined,
      gbcsTitle,
      info: groups.groups?.['variant'] ?? undefined,
    },
  ]
}

export interface LoadTemplateOptions {
  /**
   * directory to scan for RTDS files, if not provided use internal RTDS files.
   */
  path?: string

  /**
   * optional logging interface
   * @param msg text to log
   */
  logger?(msg: string): void
}

export type TemplateDirectory = Record<string, Template>

export async function loadTemplates(
  options: LoadTemplateOptions
): Promise<TemplateDirectory> {
  const logger =
    options.logger ??
    ((): void => {
      /* do nothing */
    })
  const templates = await new Promise<string[]>((a, r) =>
    glob(
      resolve(
        ...(options.path
          ? [options.path]
          : [__dirname, '..', 'templates']
        ).concat('**/*_REQUEST_DUIS.XML')
      ),
      (err, m) => (err ? r(err) : a(m))
    )
  )

  const zz = (
    await Promise.all(templates.map((t) => loadTemplate(logger, t)))
  ).filter((x) => Array.isArray(x)) as [string, Template][]

  return Object.fromEntries(zz)
}
