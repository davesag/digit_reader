"use strict";

let DigitReader = require('./lib/DigitReader');

let fs = require('fs');
let PNG = require('png-js');

let reader = new DigitReader();

let images = {
  training: [],
  predicting: []
};

const PATHS = {
  training: __dirname + '/images/training/',
  predicting: __dirname + '/images/training/'
};

let getFactfromFileName = function(fileName) {
  return parseInt(fileName.substr(fileName.lastIndexOf('_') + 1, 1));
};

let readImages = function(mode) {
  fs.readdirSync(PATHS[mode]).forEach(function(fileName) {
    if (fileName.indexOf('.png') > 0) {
      var imagePath = PATHS[mode] + fileName;
      PNG.decode(imagePath, function(pixels) {
        let data = {
          image: {
            pixels: pixels,
            height: 128,
            width: 128
          },
          fileName: fileName
        };
        if (mode === 'training') {
          data['fact'] = getFactfromFileName(fileName)
          console.log("using", data.fileName, "for training as", data.fact);
          reader.train(data.image, data.fact);
        } else {
          reader.predict(data.image, function(guess) {
            console.log('Image:', data.fileName, 'is probably a', guess);
          });          
        }
      })
    }
  });
}

readImages('training');

setTimeout(function() {
  readImages('predicting')
}, 5000);
