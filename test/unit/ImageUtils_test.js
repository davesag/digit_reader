'use strict';

var sinon = require('sinon')
var chai = require('chai');
var assert = chai.assert;

var ImageUtils = require('../../lib/ImageUtils');

describe('ImageUtils', function() {
  describe('given a PNG file', function() {
    var testImagePath = 'images/training/dave_0.png'
    it('loads an image', function(done) {
      ImageUtils.load(testImagePath, function(err, data) {
        assert.isNull(err);
        assert.isDefined(data.image);
        assert.isDefined(data.image.pixels);
        assert.typeOf(data.image.pixels, 'array');
        assert.isDefined(data.image.height);
        assert.isDefined(data.image.width);
        assert.equal(data.image.pixels.length, data.image.height * data.image.width * 4);
        done();
      })
    })
  })

  describe('given a non existant file', function() {
    var testImagePath = 'baloney.png'
    it('returns an error', function(done) {
      ImageUtils.load(testImagePath, function(err, data) {
        assert.isNotNull(err);
        done();
      });
    })
  })

  describe("getting the 'fact' from the image name", function() {
    describe('given a file with a well formed name', function() {
      var testImagePath = 'images/training/dave_0.png'
      it('returns the correct fact number', function() {
        assert.equal(ImageUtils.getFactfromFileName(testImagePath), 0);
      })
    })

    describe('given a file with a poorly formed name', function() {
      var testImagePath = 'images/training/dave.png'
      it('returns null', function() {
        assert.isNull(ImageUtils.getFactfromFileName(testImagePath));
      })
    })
  })
});
