"use strict";

let DigitReader = require('./lib/DigitReader');
let ImageLoader = require('./lib/ImageLoader');

let fs = require('fs');

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

let processImage = function(fileName, mode, next) {
  var imagePath = PATHS[mode] + fileName;
  ImageLoader.load(imagePath, function(err, data) {
    if (err) {
      console.log("error loading", fileName, err);
      callback();
    } else {
      if (mode === 'training') {
        data['fact'] = getFactfromFileName(fileName)
        console.log("using", data.fileName, "for training as", data.fact);
        reader.train(data.image, data.fact);
        next();
      } else {
        reader.predict(data.image, function(guess, chance) {
          console.log('Image:', data.fileName, 'is probably a', guess, "chance is", chance);
          next();
        });
      }
    }
  })
};


let readImages = function(mode, callback) {
  var fileNames = [];
  fs.readdirSync(PATHS[mode]).forEach(function(fileName) { 
    if (fileName.indexOf('.png') > 0) fileNames.push(fileName)
  });
  let doIt = function() {
    if (fileNames.length === 0) {
      console.log(mode, "images processed");
      callback();
    } else {
      let fileName = fileNames.pop();
      processImage(fileName, mode, function() {
        doIt();
      })
    }
  }
  doIt();
}

var go = function(count) {
  if (count-- === 0) {
    console.log('Finished');
    return;
  }

  readImages('training', function() {
    console.log('done training')
    readImages('predicting', function() {
    console.log('done predicting')
      go(count);
    });
  });
}

go(10);
