"use strict";

var co = require('co');

exports['Should correctly execute aggregation'] = {
  metadata: { requires: { } },

  // The actual test we wish to run
  test: function(configuration, test) {
    var MongoClient = require('../..')().MongoClient;

    co(function*(){
      var client = yield MongoClient.connect('mongodb://localhost:27017/test');
      try { yield yield client.collection('test2').drop(); } catch(err) {}
      // Insert two
      var result = yield client.collection('test2').insertMany([{a:1}, {b:1}])
      test.equal(2, result.insertedCount);
      // Aggregate
      var docs = yield client.collection('test2').aggregate([
                {$project: {a: 1}}
              ], {cursor: {batchSize: 10000}}).batchSize(2).toArray();
      test.equal(2, docs.length);
      // Close the connection
      yield client.close();
      test.done();
    }).catch(function(err) {
      console.log(err.stack)
      test.ok(false);
    });
  }
}