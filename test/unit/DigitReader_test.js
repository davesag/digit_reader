'use strict';

var sinon = require('sinon')
var chai = require('chai');
var assert = chai.assert;

var DigitReader = require('../../lib/DigitReader');

describe('DigitReader', function() {
  
  describe('static methods', function() {

    describe('option', function() {
      var options = {
        testLabel: {
          testKey: 'test'
        },
        testLabelIterated: [
          {
            testKey: 'test-iterated'
          }
        ]
      };

      it('without an iteration returns the right value', function() {
        assert.equal(DigitReader.option('testKey', options, 'testLabel'), 'test');
      })

      it('with an iteration returns the right value', function() {
        assert.equal(DigitReader.option('testKey', options, 'testLabelIterated', 0), 'test-iterated');
      })
      
      it('without options returns null', function() {
        assert.isNull(DigitReader.option('testKey', {}, 'testLabelIterated', 0));
      })
    });

    describe('validate', function() {
      it('without label throws an error', function() {
        assert.throws(function() {
          DigitReader.validate();
        })
      })

      it('without known label throws an error', function() {
        assert.throws(function() {
          DigitReader.validate('aardvark');
        })
      })

      describe('with known label', function() {
        it('and no iteration does not throw an error', function() {
          assert.doesNotThrow(function() {
            DigitReader.validate('input');
          })
        })

        it('and junk iteration throws an error', function() {
          assert.throws(function() {
            DigitReader.validate('input', 'junk');
          })
        })

        it('and invalid iteration throws an error', function() {
          assert.throws(function() {
            DigitReader.validate('input', 0);
          })
        })

        it('and valid iteration does not throw an error', function() {
          assert.doesNotThrow(function() {
            DigitReader.validate('conv', 0);
          })
        })
      })

    });

    describe('cleanOptions', function() {
      describe('with empty options', function() {
        var options = {};
        var label = 'input';
        var expected = {};

        it('returns empty', function() {
          assert.deepEqual(DigitReader.cleanOptions(options, label), expected);
        })
      })

      describe('with extra options', function() {
        var options = {
          input: {
            test: 'this is a test'
          }
        };
        var label = 'input';
        var expected = {};

        it('returns empty', function() {
          assert.deepEqual(DigitReader.cleanOptions(options, label), expected);
        })
      })

      describe('with overlapping options', function() {
        var options = {
          input: {
            out_sx: 64,
            out_sy: 64,
            aardvark: 'arthur'
          }
        };
        var label = 'input';
        var expected = {
          out_sx: 64,
          out_sy: 64
        };

        it('returns the correct options', function() {
          assert.deepEqual(DigitReader.cleanOptions(options, label), expected);
        })
      })
      
      describe('with an iterator', function() {
        var options = {
          conv: [
            {
              sx: 5,
              stride: 1,
              aardvark: 'arthur'
            }
          ]
        };
        var label = 'conv';
        var expected = {
          sx: 5,
          stride: 1
        };

        it('returns the correct options', function() {
          assert.deepEqual(DigitReader.cleanOptions(options, label, 0), expected);
        })
      })
    });

    describe('mergeDefaults', function() {
      describe('with no iterator', function() {
        var label = 'input';

        describe('and empty options', function() {
          var options = {};
          var expected = {
            type: 'input',
            out_sx: 128,
            out_sy: 128,
            depth: 4
          };

          it('returns the defaults', function() {
            assert.deepEqual(DigitReader.mergeDefaults(options, label), expected);
          })
        })
      })

      describe('with iterator', function() {
        var label = 'conv';
        describe('and empty options', function() {
          var options = {};
          var expected = {
            type: 'conv',
            sx:5,
            filters:16,
            stride:1,
            pad:2,
            activation:'relu'
          };

          it('returns the defaults', function() {
            assert.deepEqual(DigitReader.mergeDefaults(options, label, 0), expected);
          })
        })
      })
    });

  });

  describe('instance methods', function() {
    describe('contructor', function() {
      it('can create a DigitReader with no params', function() {
        assert.doesNotThrow(function() {
          let reader = new DigitReader();
        })
      })

      it('can create a DigitReader with empty options', function() {
        assert.doesNotThrow(function() {
          let reader = new DigitReader({});
        })
      })
    })
  })
});
