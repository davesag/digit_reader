"use strict";

let DigitReader = require('./lib/DigitReader');
let ImageUtils = require('./lib/ImageUtils');

let fs = require('fs');
let colors = require('colors/safe');

let redis = require("redis");
let client = redis.createClient();

client.on("error", function (err) {
  console.log("Redis Error", err);
});

let redisKey = "digit_reader_neural_network";

client.get(redisKey, function(err, reply) {
    // reply is null when the key is missing
  if (reply) {
    console.log("found network", reply);
  }
  let reader = new DigitReader({net: (reply) ? JSON.parse(reply) : null});

  let images = {
    training: [],
    predicting: []
  };

  const PATHS = {
    training: __dirname + '/images/training/',
    predicting: __dirname + '/images/training/'
  };

  var matchCount = 0;
  var fileCount = 0;

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
            if (data.fact !== null) {
              if (guess == data.fact) {
                colour = 'green';
                matchCount++;
              } else {
                colour = 'red';
              }
            } else {
              matchCount++; // we don't know so count it as a match anyway
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
    let imageFiles = fs.readdirSync(PATHS[mode]);
    fileCount = imageFiles.length;
    imageFiles.forEach(function(fileName) { 
      if (fileName.indexOf('.png') > 0) {
        fileNames.push(fileName)
      } else {
        fileCount--;
      }
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
      let nNet = reader.net.toJSON();
      client.set(redisKey, JSON.stringify(nNet), function(err, reply) {
        console.log('Saved neural network');
        readImages('predicting', function() {
          if (matchCount < fileCount) {
            console.log(colors.red('Only correctly matched', matchCount, 'out of', fileCount, '. Retraining.'));
            go(++count);
          } else {
            console.log(colors.green('Neural Network is now trained.'));
            client.quit();
          }
        });
      });
    });
  }

  go(0);
});

