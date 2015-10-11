# digit_reader

A machine-learning experiment using ConvNetJS.

## Preparation

* Install [`cairo`](https://github.com/Automattic/node-canvas/wiki/_pages) `brew install cairo`
* `npm install`

## Training images

Put 128 x 128 pixel colour with optional transparancy PNG formatted images in the `/images/training` folder, named as follows:

```
blah_x.png
```

where `blah` is any arbitrary string, and `x` is a digit from 0 to 9, representing the digit drawn in the image.

## Predicting images

Put 128 x 128 pixel colour with optional transparancy PNG formatted images in the `/images/predicting` folder, named however you like (but the name must end in .png).

```
npm start
```

It will train against the provided images and then output its predictions.

