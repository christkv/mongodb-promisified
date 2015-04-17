"use strict";

var co = require('co');

exports['Should correctly connect using co'] = {
  metadata: { requires: { } },

  // The actual test we wish to run
  test: function(configuration, test) {
    var MongoClient = require('../..')().MongoClient;

    co(function*(){
      // Connect using mongoclient
      var client = yield MongoClient.connect('mongodb://localhost:27017/test');
      try { yield yield client.collection('test').drop(); } catch(err) {}

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
      test.ok(false);
    });
  }
}

exports['Should correctly connect perform cursor toArray'] = {
  metadata: { requires: { } },

  // The actual test we wish to run
  test: function(configuration, test) {
    var MongoClient = require('../..')().MongoClient;

    co(function*(){
      // Connect using mongoclient
      var client = yield MongoClient.connect('mongodb://localhost:27017/test');
      try { yield yield client.collection('test1').drop(); } catch(err) {}
      // Perform a toArray
      var result = yield client.collection('test1').insertMany([{a:1}, {b:1}])
      // Perform a query and toArray
      var docs = yield client.collection('test1').find({}).toArray();
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

exports['Should correctly connect perform cursor stream'] = {
  metadata: { requires: { } },

  // The actual test we wish to run
  test: function(configuration, test) {
    var MongoClient = require('../..')().MongoClient;

    co(function*() {
      // Connect to the database
      var client = yield MongoClient.connect('mongodb://localhost:27017/db');
      try { yield yield client.collection('test1').drop(); } catch(err) {}
      // Insert a document
      var result = yield client.collection('test1').insertOne({a:1});
      // Get the documents
      var rawCursor = client.collection('test1').find({}).object;
      rawCursor.on('data', function(data) {});
      rawCursor.on('end', function() {
        client.close();
        test.done();
      });
    }).catch(function(err) {
      console.log(err.stack);
    });
  }
}

