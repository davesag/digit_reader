'use strict';

var sinon = require('sinon')
var chai = require('chai');
var assert = chai.assert;

var ImageVol = require('../../lib/ImageVol');
var testImages = require('../support/testImages');

describe('ImageVol', function() {
  describe('given an Image', function() {
    var testImage = {
      pixels: testImages['32x32_rgba_array'],
      height: 32,
      width: 32
    }
    var normalisedImageArray = testImages['32x32_rgba_normalised_array'];
    var iv = new ImageVol(testImage);

    it('returns a Vol with normalised data', function(done) {
      iv.toVol(function(vol) {
        assert.deepEqual(vol.w, normalisedImageArray);
        done();
      })
    })
  })
});
