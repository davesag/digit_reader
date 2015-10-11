"use strict";

var fs = require('fs');
var PNG = require('png-js'); // TODO: replace this with something asynchronous

class ImageUtils {

  // NOTE: will throw an error if not given a PNG file, so wrap use of this in try .. catch
  static load(pathToImage, callback) {
    fs.realpath(pathToImage, function(err, resolvedPath) {
      if (err === null) {
        // file exists
        fs.stat(resolvedPath, function(err, stat) {
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
          });
        });
      } else {
        // file doesn't exist
        callback(err, null);
      }
    });
  }
  
  static getFactfromFileName(fileName) {
    let result = parseInt(fileName.substr(fileName.lastIndexOf('_') + 1, 1));
    if (isNaN(result)) return null;
    return result;
  }

}

module.exports = ImageUtils;
