# [cyz-form](https://github.com/sonusindhu/cyz-form)

[![](https://img.shields.io/badge/Powered%20by-jslib%20base-brightgreen.svg)](https://github.com/yanhaijing/jslib-base)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/sonusindhu/cyz-form/blob/master/LICENSE)
[![CI](https://github.com/sonusindhu/cyz-form/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/sonusindhu/cyz-form/actions/workflows/ci.yml)
[![npm](https://img.shields.io/badge/npm-0.1.0-orange.svg)](https://www.npmjs.com/package/cyz-form)
[![NPM downloads](http://img.shields.io/npm/dm/cyz-form.svg?style=flat-square)](http://www.npmtrends.com/cyz-form)
[![Percentage of issues still open](http://isitmaintained.com/badge/open/sonusindhu/cyz-form.svg)](http://isitmaintained.com/project/sonusindhu/cyz-form 'Percentage of issues still open')

## Characteristics

- Coded in ES6+ or TypeScript, easily compile and generate production code
- Supports multi environment, including default browsers, Node, AMD, CMD, Webpack, Rollup, Fis and so on.
- Integrated [jsmini](https://github.com/jsmini)

**Note:** When `export` and `export default` are not used at the same time, there is the option to
turn on `legacy mode`. Under `legacy mode`, the module system can be compatible with `IE6-8`. For more information on legacy mode,
please see rollup supplemental file.

## Compatibility

Unit tests guarantee support on the following environment:

| IE  | CH   | FF   | SF  | OP   | IOS   | Android | Node |
| --- | ---- | ---- | --- | ---- | ----- | ------- | ---- |
| 11+ | 100+ | 100+ | 16+ | 100+ | 10.3+ | 4.1+    | 14+  |

> Here is a [demo](./demo/form.html)

## Directory

```
├── demo - Using demo
├── dist - Compiler output code
├── doc - Project documents
├── src - Source code directory
├── test - Unit tests
├── CHANGELOG.md - Change log
└── TODO.md - Planned features
```

## Usage Instructions

Using npm, download and install the code.

```bash
$ npm install --save cyz-form
```

For node environment：

```js
const CyzForm = require('cyz-form');
```

For webpack or similar environment：

```js
import CyzForm from 'cyz-form';
```

For browser environment:

```html
<script src="node_modules/cyz-form/dist/cyz-form.full.min.js"></script>
```

For embeding form:

```html
<h2>Form 1 - With selector</h2>
<div class="my-form"></div>
<script>
  const form = CyzForm.FormBuilder.create({
    selector: '.my-form',
    formId: 'FORM_ID_HERE', // replace Form ID
    portalId: 'PORTAL_ID_HERE', // replace Portal ID
  });
  console.log(form);
</script>

<h2>Form 1 - Without selector</h2>
<script>
  const form = CyzForm.FormBuilder.create({
    formId: 'FORM_ID_HERE', // replace Form ID
    portalId: 'PORTAL_ID_HERE', // replace Portal ID
  });
  console.log(form);
</script>
```

## Documents

[API](./doc/api.md)

## Contribution Guide

For the first time to run, you need to install dependencies firstly.

```bash
$ npm install
```

To build the project:

```bash
$ npm run build
```

To run unit tests:

```bash
$ npm test
```

> Note: The browser environment needs to be tested manually under `test/browser`

Modify the version number in package.json, modify the version number in README.md, modify the CHANGELOG.md, and then release the new version.

```bash
$ npm run release
```

## Contributors

[contributors](https://github.com/sonusindhu/cyz-form/graphs/contributors)

## Change Log

[CHANGELOG.md](./CHANGELOG.md)

## TODO

[TODO.md](./TODO.md)
