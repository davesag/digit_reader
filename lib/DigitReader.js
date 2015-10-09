"use strict";

let ImageVol = require('./ImageVol');

const DEFAULTS = {
  // declare size of input
  // output Vol is of size 128x128x4 here
  input: {
    type:  'input',
    out_sx: 128,
    out_sy:  128,
    depth:  4
  },

  conv: [
    // the first layer will perform convolution with 16 kernels, each of size 5x5.
    // the input will be padded with 2 pixels on all sides to make the output Vol of the same size
    // output Vol will thus be 128x128x16 at this point W2 = (W1 - sx + pad*2)/stride + 1
    {
      type:   'conv',
      sx:      5, // width is (128 - 5 + 4) + 1 = 128
      filters: 16,
      stride:  1,
      pad:     2,
      activation:'relu'
    },

    // output Vol is of size 128x128x20 here
    {
      type:   'conv',
      sx:      5,
      filters: 20,
      stride:  1,
      pad:     2,
      activation:'relu'
    }
  ],

  // output Vol is of size 16x16x16 here
  pool: {
    type:  'pool',
    sx:     8,
    stride: 2
  },

  // output Vol is of size 1x1x10 here
  softmax: {
    type:       'softmax',
    num_classes: 10
  },

  // tweak this
  trainer: {
    method:    'adadelta',
    l2_decay:   0.001,
    batch_size: 10
  }
};

var ConvNetJS = require("ConvNetJS");

class DigitReader {

  constructor(options) {
    if (!options) options = {};
    let layerDefinitions = [];
    layerDefinitions.push(DigitReader.mergeDefaults(options, 'input'));
    layerDefinitions.push(DigitReader.mergeDefaults(options, 'conv', 0));
    layerDefinitions.push(DigitReader.mergeDefaults(options, 'pool'));
    layerDefinitions.push(DigitReader.mergeDefaults(options, 'conv', 1));
    layerDefinitions.push(DigitReader.mergeDefaults(options, 'pool'));
    layerDefinitions.push(DigitReader.mergeDefaults(options, 'conv', 1));
    layerDefinitions.push(DigitReader.mergeDefaults(options, 'pool'));
    layerDefinitions.push(DigitReader.mergeDefaults(options, 'conv', 1));
    layerDefinitions.push(DigitReader.mergeDefaults(options, 'pool'));
    
    let softmax = DigitReader.mergeDefaults(options, 'softmax');
    this.length = softmax['num_classes'];
    layerDefinitions.push(softmax);

    this.net = new ConvNetJS.Net();
    // console.log(layerDefinitions);
    this.net.makeLayers(layerDefinitions);
    this.trainer = new ConvNetJS.Trainer(this.net, DigitReader.mergeDefaults(options, 'trainer'));
    // console.log('net', this.net.toJSON());
  }

  train(image, fact) {
    if (!image) throw new Error({message: "Missing Image"});
    if (typeof fact === 'undefined') throw new Error({message: "Missing fact"});
    if(typeof fact !== 'number') throw new Error({
      message: "Expected fact to be a number, not a " + fact.class.name,
      context: fact
    });
    if (fact < 0 || fact >= this.length) throw new Error({
      message: "Fact must be between 0 and " + (this.length - 1),
      context: fact
    });
    let imageVol = new ImageVol(image);
    imageVol.toVol(function(vol) {
      this.trainer.train(vol, fact);
    }.bind(this));
  }

  predict(image, callback) {
    let imageVol = new ImageVol(image);
    imageVol.toVol(function(vol) {
      let probabilities = this.net.forward(vol)
      let guess = null;
      let bestGuess = null;
      for (let i = 0, l = this.length; i < l; i++) {
        if (guess === null || probabilities.w[i] > guess) {
          guess = probabilities.w[i];
          bestGuess = i;
        }
      }
      callback(bestGuess, probabilities.w[bestGuess]);
    }.bind(this));
  }

  static option(key, options, label, iteration) {
    if (!options || !options[label]) return null;
    if (typeof iteration === 'number') {
      return options[label][iteration][key];
    }
    return options[label][key];
  }

  static validate(label, iteration) {
    if (!label || !DEFAULTS[label])
      throw new Error({message: "Invalid label", context: label});
    if (typeof iteration !== 'undefined') {
      if (typeof iteration !== 'number')
        throw new Error({message: "Iteration must be a number", context: iteration});
      if (!DEFAULTS[label][iteration])
        throw new Error({message: "Invalid iteration for " + label, context: iteration});
    }
  }

  static cleanOptions(options, label, iteration) {
    DigitReader.validate(label, iteration);
    let newOptions = {};
    let allowedKeys = Object.keys((typeof iteration === 'number') ? DEFAULTS[label][iteration] : DEFAULTS[label]);
    allowedKeys.forEach(function(key) {
      let opt = DigitReader.option(key, options, label, iteration);
      if (opt) newOptions[key] = opt;
    });
    return newOptions;
  }

  static mergeDefaults(options, label, iteration) {
    let newOptions = DigitReader.cleanOptions(options, label, iteration);
    if (typeof iteration === 'number') {
      Object.assign(newOptions, DEFAULTS[label][iteration], newOptions);
    } else {
      Object.assign(newOptions, DEFAULTS[label], newOptions);
    }
    return newOptions;
  }
  
};

module.exports = DigitReader;
