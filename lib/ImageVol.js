"use strict";

var ConvNetJS = require("ConvNetJS");
var Vol = ConvNetJS.Vol;

class ImageVol {

  // image holds {pixels: [], height: 0, width: 0}
  constructor(image) {
    this.image = image;
  }

  // returns a Vol of size (W, H, 4). 4 is for RGBA
  toVol(callback) {
    // normalize image pixels to [-0.5, 0.5]
    // console.log(pixels);
    let pixelVolume = this.image.pixels.map(function(pixel) {
      return (pixel / 255.0) - 0.5;
    });
    
    //input volume (image)
    let vol = new Vol(this.image.width, this.image.height, 4, 0.0); 
    vol.w = pixelVolume;
    callback(vol);
  }
}

module.exports = ImageVol;

