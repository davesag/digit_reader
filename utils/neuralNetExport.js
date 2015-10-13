"use strict";

let fs = require('fs');
let redis = require("redis");
let client = redis.createClient();

client.on("error", function (err) {
  console.log("Redis Error", err);
});

let redisKey = "digit_reader_neural_network";

client.get(redisKey, function(err, reply) {

  fs.writeFileSync('neural_network.json', reply);

  client.quit();
});

