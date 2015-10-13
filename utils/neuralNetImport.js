"use strict";

let fs = require('fs');
let redis = require("redis");
let client = redis.createClient();

client.on("error", function (err) {
  console.log("Redis Error", err);
});

let redisKey = "digit_reader_neural_network";

let json = fs.readFileSync('neural_network.json');

client.set(redisKey, json, function(err, reply) {

  client.quit();
});

