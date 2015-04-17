"use strict";

var co = require('co');

exports['Should correctly connect using co'] = {
  metadata: { requires: { } },

  // The actual test we wish to run
  test: function(configuration, test) {
    var MongoClient = require('../..').MongoClient;

    co(function*(){
      // Connect using mongoclient
      var client = yield MongoClient.connect('mongodb://localhost:27017/test');
      // Close the connection
      yield client.close();
      test.done();
    }).catch(function(err) {
      test.ok(false);
    });
  }
}
