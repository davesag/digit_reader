"use strict";

var fs = require('fs');
var PNG = require('png-js');

class ImageLoader {

  static load(pathToImage, callback) {
    fs.realpath(pathToImage, function(err, resolvedPath) {
      if (err === null) {
        fs.stat(resolvedPath, function(err, stat) {
          if (err === null) {
            // file exists
            PNG.decode(resolvedPath, function(pixels) {
              let data = {
                image: {
                  pixels: Array.from(pixels),
                  height: 128,
                  width: 128
                },
                fileName: pathToImage
              };
              callback(null, data);
            })
          } else {
            // file doesn't exist
            callback(err, null);
          }
        })
      } else {
        // path is bunk
        callback(err, null);
      }
    })
  }
  
  static getFactfromFileName(fileName) {
    return parseInt(fileName.substr(fileName.lastIndexOf('_') + 1, 1));
  };

}

module.exports = ImageLoader;
