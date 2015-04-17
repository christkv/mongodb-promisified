"use strict";

var co = require('co');

exports['Should correctly listCollections'] = {
  metadata: { requires: { } },

  // The actual test we wish to run
  test: function(configuration, test) {
    var MongoClient = require('../..')().MongoClient;

    co(function*(){
      var client = yield MongoClient.connect('mongodb://localhost:27017/test');
      try { yield yield client.collection('test5').drop(); } catch(err) {}

      // Create an index
      var result = yield client.collection('test5').createIndex({a:1})
      test.equal('a_1', result);

      // List all the indexes
      var collections = yield client.listCollections().toArray();
      test.ok(collections.length > 0);

      // Close the connection
      yield client.close();
      test.done();
    }).catch(function(err) {
      console.log(err.stack)
      test.ok(false);
    });
  }
}
