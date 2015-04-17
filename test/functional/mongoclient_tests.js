"use strict";

var co = require('co');

exports['Should correctly execute insertOne'] = {
  metadata: { requires: { } },

  // The actual test we wish to run
  test: function(configuration, test) {
    var MongoClient = require('../..').MongoClient;

    co(function*(){
      var client = yield MongoClient.connect('mongodb://localhost:27017/test');

      // Insert one
      var result = yield client.collection('test').insertOne({a:1})
      test.equal(1, result.insertedCount);

      // Insert two
      var result = yield client.collection('test').insertMany([{a:1}, {b:1}])
      test.equal(2, result.insertedCount);

      // Close the connection
      yield client.close();
      test.done();
    }).catch(function(err) {
      console.log(err.stack)
      test.ok(false);
    });
  }
}
