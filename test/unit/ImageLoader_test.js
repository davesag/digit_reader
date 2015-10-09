'use strict';

var sinon = require('sinon')
var chai = require('chai');
var assert = chai.assert;

var ImageLoader = require('../../lib/ImageLoader');

describe.only('ImageLoader', function() {
  var testImagePath = 'images/training/dave_0.png'
  it('loads an image', function(done) {
    ImageLoader.load(testImagePath, function(err, data) {
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
});
