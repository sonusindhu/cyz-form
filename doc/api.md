# Document

This is a Form Builder library.

## Api template

For example:

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
  CyzForm.FormBuilder.create({
    selector: '.my-form',
    formId: 'FORM_ID_HERE', // replace Form ID
    portalId: 'PORTAL_ID_HERE', // replace Portal ID
  });
</script>

<h2>Form 1 - Without selector</h2>
<script>
  CyzForm.FormBuilder.create({
    formId: 'FORM_ID_HERE', // replace Form ID
    portalId: 'PORTAL_ID_HERE', // replace Portal ID
  });
</script>

<h2>Form 3 - With Callback</h2>
<script>
  const form = CyzForm.FormBuilder.create({
    formId: 'FORM_ID_HERE', // replace Form ID
    portalId: 'PORTAL_ID_HERE', // replace Portal ID
  });
  form.on('init', function ($event) {
    console.log('after form init', $event);
  });
  form.on('beforeSubmit', function ($event) {
    console.log('before form submitted', $event);
  });
  form.on('afterSubmit', function ($event) {
    console.log('form has been submitted', $event);
  });
</script>
```
