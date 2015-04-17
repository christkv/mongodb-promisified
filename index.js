var m = require('mongodb')
  , C = m.Collection
  , D = m.Db
  , M = m.MongoClient;

var promisify = function(target, original, ignoreFields) {
  ignoreFields = ignoreFields || [];
  // Map the prototype functions
  for(var name in original) {
    if(ignoreFields.indexOf(name) != -1) {
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
            
            return new Promise(function(resolve, reject) {
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

/*
 * Collection wrapper class
 */
var Collection = function(collection) {
  this.object = collection;
}

// Promisify
promisify(Collection.prototype, C.prototype);

/*
 * DB wrapper class
 */
var Db = function(db) {
  this.object = db;
}

// Promisify
promisify(Db.prototype, D.prototype, ['collection']);

Db.prototype.collection = function(name) {
  return new Collection(this.object.collection(name));
}

/*
 * MongoClient wrapper class
 */
var MongoClient = function() {}
MongoClient.connect = function(url, options) {
  return new Promise(function(resolve, reject) {
    M.connect(url, options, function(err, db) {
      if(err) return reject(err);
      resolve(new Db(db));
    })
  });
}

module.exports = {MongoClient: MongoClient};