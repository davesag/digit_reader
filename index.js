"use strict";

let DigitReader = require('./lib/DigitReader');
let ImageUtils = require('./lib/ImageUtils');

let fs = require('fs');
let colors = require('colors/safe');

let reader = new DigitReader();

let images = {
  training: [],
  predicting: []
};

const PATHS = {
  training: __dirname + '/images/training/',
  predicting: __dirname + '/images/training/'
};

var matchCount = 0; // a global! cound do this more cleanly.

let processImage = function(fileName, mode, next) {
  var imagePath = PATHS[mode] + fileName;
  ImageUtils.load(imagePath, function(err, data) {
    if (err) {
      console.log("error loading", fileName, err);
      callback();
    } else {
      data['fact'] = ImageUtils.getFactfromFileName(fileName)
      if (mode === 'training') {
        console.log("using", data.fileName, "for training as", data.fact);
        reader.train(data.image, data.fact);
        next();
      } else {
        reader.predict(data.image, function(guess, chance) {
          let confidence = 'might be a';
          let colour = 'white';
          if (guess == data.fact) {
            colour = 'green';
            matchCount++;
          } else {
            colour = 'red';
          }
          if (chance < 0.1) {
            confidence = "probably isn't a";
          }
          if (chance > 0.5) confidence = 'is probably a';
          if (chance > 0.9) confidence = 'is a';
          console.log(colors[colour]("Image:" + data.fileName + ' ' + confidence + ' ' + guess + ". Chance is " + chance));
          next();
        });
      }
    }
  })
};

let readImages = function(mode, callback) {
  var fileNames = [];
  matchCount = 0;
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

  readImages('training', function() {
    console.log('training round', count, 'completed');
    readImages('predicting', function() {
      if (matchCount < 10) {
        console.log(colors.red('Only correctly matched', matchCount, 'out of 10. Retraining.'));
        go(++count);
      } else {
        console.log(colors.green('Neural Network is now trained.'));
      }
    });
  });
}

go(0);
