# digit_reader

A machine-learning experiment using [ConvNetJS](http://cs.stanford.edu/people/karpathy/convnetjs/).

## Preparation

* Install [`redis`](http://redis.io) `brew install redis`
* `npm install`

## Training images

Put 128 x 128 pixel colour with optional transparancy PNG formatted images in the `/images/training` folder, named as follows:

```
blah_x.png
```

where `blah` is any arbitrary string, and `x` is a digit from 0 to 9, representing the digit drawn in the image.

run

```sh
npm start
```

The system will initialise a brand new 6 layer neural network and start training using the images supplied. Once it's done it will make a set of predictions about those images, trying to guess the digits drawn within.  Because the training imaages are named with the correct digit, the system will know if its prediction is accurate or not.  It will keep training until it predicts all of the digits correctly.

After each training round it will save the updated neural network into a Redis store. (You must have Redis installed).

Once the run is complete you can export the neural network to a plain JSON formatted text file:

run

```
npm run export
```

You can then safely wipe the Redis store if you wish and play with the various settings.

_documentation to come_

You can re-import the saved neural network from its text file

run

```
npm run import
```

## Predicting images (Not Implemeted yet)

Put 128 x 128 pixel colour with optional transparancy PNG formatted images in the `/images/predicting` folder, named however you like (but the name must end in .png).

```
npm start
```

It will train against the provided images and then output its predictions.

## To Do

* Wrap this in a web interface that allows anyone to upload image files for training.
* Implement the general prediction code
* make the error handling of the import and export more robust
* more unit tests

