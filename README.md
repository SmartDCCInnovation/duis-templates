# DUIS Templates

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Tests](https://github.com/SmartDCCInnovation/duis-templates/actions/workflows/node.yml/badge.svg?branch=main&event=push)](https://github.com/SmartDCCInnovation/duis-templates/actions/workflows/node.yml)
[![codecov](https://codecov.io/gh/SmartDCCInnovation/duis-templates/branch/main/graph/badge.svg?token=1FGAXZ5OS6)](https://codecov.io/gh/SmartDCCInnovation/duis-templates)

Provides a number of DUIS templates intended for use with [DCC Boxed][boxed].
The templates originate from the Reference Test Data Set project. Conversion of
the templates from `XML` into `JSON` is managed by the
[duis-parser][duis-parser] tool. Further, provides a binding for the
[Fuse.js][fusejs] library to easily search the templates, e.g. by *GBCS Use
Case*, *Service Request Variant*, *Service Request Name*. 

## Usage

Developed using typescript with `node 16`.

### Load Templates

```ts
import { loadTemplates, TemplateDirectory } from '@smartdcc/duis-templates'

const templates: TemplateDirectory = await loadTemplates({}) 
```

Or with a `logger` specified, which will write a line of text in the case it is
unable to load a template:

```ts
const templates = await loadTemplates({ logger: console.log })
```

### Template Usage

Once the templates are loaded, a `TemplateDirectory` will be obtained. This is
of the following type:

```ts
type TemplateDirectory = Record<string, Template>
```

The `keys` of the directory are tags obtained (i.e. normalised) from the file
names of the templates. For example, a typical *meter read* has the tag
`ECS17b_4.1.1_SINGLE`. This includes the GBCS use case code, the service request
variant and optional additional data (in this case `SINGLE`). As these tags are
chosen when the Reference Test Data Set is put together, they are fixed in this
project.

The `Template` stored in the dictionary has a number of meta-data items
associated, as well as a the `JSON` representation of the template. The
templates is provided in two options, `normal` and `simplified` - the meaning of
these two options is described in [duis-parser][duis-parser]. In most (if not
all) cases its recommended to use the `simplified` version.

As an example, the `Template` for the `ECS17b_4.1.1_SINGLE` is as follows when
printed from a Node REPL session. Notice the additional meta-data associated
with the templates, such as `serviceReferenceVariant` and `gbcsTitle` keys. 

```js
> directory['ECS17b_4.1.1_SINGLE']
{
  fileName: '/path/to/package/templates/ECS17b_4.1.1_SINGLE_SUCCESS_REQUEST_DUIS.XML',
  normal: {
    '?xml': { '@_version': '1.0', '@_encoding': 'UTF-8' },
    'sr:Request': {
      'sr:Header': [Object],
      'sr:Body': [Object],
      'ds:Signature': [Object],
      '@_xmlns:ds': 'http://www.w3.org/2000/09/xmldsig#',
      '@_xmlns:sr': 'http://www.dccinterface.co.uk/ServiceUserGateway',
      '@_xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
      '@_schemaVersion': '5.1'
    }
  },
  simplified: {
    header: {
      type: 'request',
      requestId: [Object],
      commandVariant: [Object],
      serviceReference: '4.1',
      serviceReferenceVariant: [Object]
    },
    body: { ReadInstantaneousImportRegisters: '' }
  },
  serviceReferenceVariant: {
    'Service Request Name': 'Read Instantaneous Import Registers',
    'Service Reference': '4.1',
    'Service Reference Variant': '4.1.1',
    Critical: 'No',
    'On Demand': 'Yes',
    'Future Dated Response Pattern': 'DSP',
    'DCC Scheduled': 'No',
    'Non-Device Request': 'No',
    'Eligible User Roles': [ 'IS', 'GS', 'ED', 'GT' ]
  },
  gbcs: 'ECS17b',
  gbcsVariant: undefined,
  gbcsTitle: 'ECS17b Read ESME Energy Registers (Import Energy)',
  info: 'SINGLE'
}
```

To convert templates back into XML, please see the [duis-parser][duis-parser]
library as it provides a `constructDuis` function. It also provides guidance on
how to sign the XML.

### Searching

As there are lots of templates, often with slight variants a search feature is
provided. This is a light-weight wraparound the [Fuse.js][fusejs] with some of
the parameters set to useable defaults.

However, as Fuse.js expects the data it searches to be a list instead of a
dictionary, the dictionary is converted into a list using `Object.entries`
function. The result of this is that the format of the searched data is as
follows:

```js
[
  [ tag1, Template1 ],
  [ tag2, Template2 ],
  [ tag3, Template3 ],
  ...
]
```

Thus, in the results of the search, each tag is referenced as `0` and the fields
of the template are prefixed with `1.`.

Below is an example of how to use the search:

```ts
import { search } from '@smartdcc/duis-templates'

const fuse = search(directory)
console.log(fuse.search('4.1.1'))
```

Which could output the following:

```js
[
  {
    item: [ 'ECS17b_4.1.1_DSP_FUTURE_DATED', [Object] ],
    refIndex: 90,
    matches: [ [Object], [Object] ]
  },
  {
    item: [ 'ECS17b_4.1.1', [Object] ],
    refIndex: 91,
    matches: [ [Object], [Object] ]
  },
  {
    item: [ 'ECS17b_4.1.1_SINGLE', [Object] ],
    refIndex: 92,
    matches: [ [Object], [Object] ]
  },
  {
    item: [ 'ECS17b_4.1.1_TWIN', [Object] ],
    refIndex: 93,
    matches: [ [Object], [Object] ]
  },
  {
    item: [ 'GCS13a_4.1.1_RELIABLE_GPF', [Object] ],
    refIndex: 211,
    matches: [ [Object], [Object] ]
  },
  ...
```

The structure of the result set is described in the Fuse.js documentation. Of
interest, the `matches` item shows which key in the Template was matched and the
position in the string too.

## Contributing

Contributions are welcome!

When submitting a pull request, please ensure:

  1. Each PR is concise and provides only one feature/bug fix.
  2. Unit test are provided to cover feature. The project uses `jest`. To test,
     run `npm run test:cov` to view code coverage metrics.
  3. Bugfixes are reference the GitHub issue.
  4. If appropriate, update documentation.
  5. Before committing, run `npm run lint` and `npm run prettier-check`.

If you are planning a new non-trivial feature, please first raise a GitHub issue
to discuss it to before investing your time to avoid disappointment.

Any contributions will be expected to be licensable under GPLv3.

## Other Info

Copyright 2022, Smart DCC Limited, All rights reserved. Project is licensed under GPLv3.


[duis]: https://smartenergycodecompany.co.uk/the-smart-energy-code-2/ "Smart Energy Code"
[duis-parser]: https://github.com/SmartDCCInnovation/duis-parser "DUIS Parser"
[boxed]: https://www.smartdcc.co.uk/our-smart-network/network-products-services/dcc-boxed/ "DCC Boxed"
[fusejs]: https://fusejs.io/ "Fuse.js"