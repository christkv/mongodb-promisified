"use strict";

var co = require('co');

exports['Should correctly createIndex'] = {
  metadata: { requires: { } },

  // The actual test we wish to run
  test: function(configuration, test) {
    var MongoClient = require('../..').MongoClient;

    co(function*(){
      var client = yield MongoClient.connect('mongodb://localhost:27017/test');
      try { yield yield client.collection('test4').drop(); } catch(err) {}

      // Create an index
      var result = yield client.collection('test4').createIndex({a:1})
      test.equal('a_1', result);

      // List all the indexes
      var indexes = yield client.collection('test4').listIndexes().toArray();
      test.equal(2, indexes.length);

      // Close the connection
      yield client.close();
      test.done();
    }).catch(function(err) {
      console.log(err.stack)
      test.ok(false);
    });
  }
}
