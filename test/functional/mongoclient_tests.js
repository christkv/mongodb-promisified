"use strict";

var co = require('co');

exports['Should correctly execute insertOne'] = {
  metadata: { requires: { } },

  // The actual test we wish to run
  test: function(configuration, test) {
    var MongoClient = require('../..')().MongoClient;

    co(function*(){
      var client = yield MongoClient.connect('mongodb://localhost:27017/test');
      // Close the connection
      yield client.close();
      test.done();
    }).catch(function(err) {
      console.log(err.stack)
      test.ok(false);
    });
  }
}

exports['Should correctly execute insertOne using Bluebird'] = {
  metadata: { requires: { } },

  // The actual test we wish to run
  test: function(configuration, test) {
    var Promise = require("bluebird")
      , MongoClient = require('../..')(Promise).MongoClient;

    co(function*(){
      var client = yield MongoClient.connect('mongodb://localhost:27017/test');
      // Close the connection
      yield client.close();
      test.done();
    }).catch(function(err) {
      console.log(err.stack)
      test.ok(false);
    });
  }
}
