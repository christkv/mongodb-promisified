var m = require('mongodb')
  , C = m.Collection
  , D = m.Db
  , Cr = m.Cursor
  , M = m.MongoClient;

//
// Exports a promise library, let's you pass your own promise library
module.exports = function(promise) {
  promise = promise || Promise;

  var promisify = function(target, original, overrideFields) {
    // Ensure we have some fields
    overrideFields = overrideFields || [];
    // Map the prototype functions
    for(var name in original) {
      if(overrideFields.indexOf(name) == -1) {
        continue;
      }

      try {
        // Do we have a function ?
        if(typeof original[name] == 'function') {
          var func = original[name];

          // Map the function
          var mapFunction = function(_name) {
            target[_name] = function() {
              var self = this;
              var args = Array.prototype.slice.call(arguments, 0);
              
              return new promise(function(resolve, reject) {
                args.push(function(err, r) {
                  if(err) return reject(err);
                  resolve(r);
                });

                self.object[_name].apply(self.object, args)
              });
            }
          }

          mapFunction(name);
        }
      } catch(err) {
        // Catch any attempt to access getters
      }
    }
  }

  var chainable = function(target, overrideFields) {
    overrideFields.map(function(_name) {
      target[_name] = function() {
        var self = this;
        var args = Array.prototype.slice.call(arguments, 0);
        // Set up the target
        self.object[_name].apply(self.object, args);
        return self;
      }
    });
  }

  /*
   * Collection wrapper class
   */
  var Collection = function(collection) {
    this.object = collection;
  }

  // Promisify
  promisify(Collection.prototype, C.prototype, [
      'insertOne', 'insertMany', 'bulkWrite'
    , 'updateOne', 'replaceOne', 'updateMany'
    , 'deleteOne', 'deleteMany', 'save'
    , 'findOne', 'rename', 'options'  
    , 'createIndex', 'createIndexes', 'isCapped'
    , 'dropIndex', 'dropIndexes'
    , 'reIndex', 'ensureIndex'
    , 'indexExists', 'indexInformation', 'indexes'
    , 'count', 'distinct', 'stats'
    , 'findOneAndDelete', 'findOneAndReplace'
    , 'findOneAndUpdate', 'parallelCollectionScan'
    , 'geoNear', 'geoHaystackSearch', 'group'
    , 'mapReduce', 'drop'
  ]);

  Collection.prototype.find = function() {
    var args = Array.prototype.slice.call(arguments, 0);
    var cursor = this.object.find.apply(this.object, args);
    return new Cursor(cursor);
  }

  Collection.prototype.aggregate = function() {
    var args = Array.prototype.slice.call(arguments, 0);
    var cursor = this.object.aggregate.apply(this.object, args);
    if(cursor) return new AggregateCursor(cursor);
  }

  Collection.prototype.listIndexes = function() {
    var args = Array.prototype.slice.call(arguments, 0);
    return new CommandCursor(this.object.listIndexes.apply(this.object, args));
  }

  /*
   * CommandCursor wrapper class
   */
  var CommandCursor = function(cursor) {
    this.object = cursor;  
  }

  CommandCursor.prototype.next = function() {
    var self = this;

    return new promise(function(resolve, reject) {
      self.object.next(function(err, doc) {
        if(err) return reject(err);
        resolve(doc);
      });
    });
  }

  CommandCursor.prototype.toArray = function() {
    var self = this;

    return new promise(function(resolve, reject) {
      self.object.toArray(function(err, docs) {
        if(err) return reject(err);
        resolve(docs);
      });
    });
  }

  /*
   * AggregateCursor wrapper class
   */
  var AggregateCursor = function(cursor) {
    this.object = cursor;  
  }

  AggregateCursor.prototype.next = function() {
    var self = this;

    return new promise(function(resolve, reject) {
      self.object.next(function(err, doc) {
        if(err) return reject(err);
        resolve(doc);
      });
    });
  }

  AggregateCursor.prototype.toArray = function() {
    var self = this;

    return new promise(function(resolve, reject) {
      self.object.toArray(function(err, docs) {
        if(err) return reject(err);
        resolve(docs);
      });
    });
  }

  chainable(AggregateCursor.prototype, ['batchSize', 'geoNear', 'group'
    , 'limit', 'match', 'maxTimeMS', 'out'
    , 'project', 'redact', 'skip', 'sort', 'unwind'
  ]);

  /*
   * DB wrapper class
   */
  var Db = function(db) {
    this.object = db;
  }

  // Promisify
  promisify(Db.prototype, D.prototype, [
      'close', 'command', 'createCollection', 'stats', 'eval', 'renameCollection'
    , 'dropCollection', 'dropDatabase', 'collections', 'executeDbAdminCommand'
    , 'addUser', 'removeUser', 'authenticate', 'logout'
  ]);

  Db.prototype.collection = function(name) {
    return new Collection(this.object.collection(name));
  }

  Db.prototype.listCollections = function() {
    var args = Array.prototype.slice.call(arguments, 0);
    return new CommandCursor(this.object.listCollections.apply(this.object, args));
  }

  Db.prototype.db = function(dbName) {
    return new Db(this.object.db(dbName));
  }

  /*
   * Cursor wrapper class
   */
  var Cursor = function(cursor) {
    this.object = cursor;
  }

  // Promisify
  promisify(Cursor.prototype, Cr.prototype, ['toArray', 'next'], []);
  chainable(Cursor.prototype, [
      'filter', 'addCursorFlag', 'addQueryModifier'
    , 'comment', 'maxTimeMS', 'maxTimeMs'
    , 'project', 'sort', 'batchSize', 'limit', 'skip'
  ]);

  /*
   * MongoClient wrapper class
   */
  var MongoClient = function() {}
  MongoClient.connect = function(url, options) {
    return new promise(function(resolve, reject) {
      M.connect(url, options, function(err, db) {
        if(err) return reject(err);
        resolve(new Db(db));
      })
    });
  }

  // Return the classes
  return {MongoClient: MongoClient};
}


// module.exports = {MongoClient: MongoClient};