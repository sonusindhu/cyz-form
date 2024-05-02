var expect = require('expect.js');

// ts Test compiled files
var CyzForm = require('../src/index.ts');
var util = require('../src/util.function.ts');

describe('unit test', function () {
  this.timeout(1000);

  describe('CyzForm Class', function () {
    it('CyzForm is intialized', function () {
      expect(CyzForm).to.equal(CyzForm);
    });
  });

  describe('Util Functions - Validate input', function () {
    it('field is required', function () {
      const isInvalid = util.validateInput('my value', [
        { key: 'required', value: 'true' },
      ]);
      expect(isInvalid).to.eql(null);
    });

    it('max value - 99999', function () {
      const isInvalid = util.validateInput('999', [
        { key: 'max', value: '99999' },
      ]);
      expect(isInvalid).to.eql(null);
    });

    it('min value - 0', function () {
      const isInvalid = util.validateInput('10', [{ key: 'min', value: '0' }]);
      expect(isInvalid).to.eql(null);
    });

    it('Minus is not accepted', function () {
      const isInvalid = util.validateInput('-10', [{ key: 'min', value: '0' }]);
      expect(isInvalid).not.to.eql(null);
    });
  });
});
