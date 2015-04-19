# A promisified MongoDB driver for ES6

The library wraps the 2.0.x driver with promises allowing you to access most of the functionality of the 2.0.x driver using your favorite Promise library.

## Using the library

```js
var co = require('co')
  , MongoClient = require('mongodb-promisified')().MongoClient;

co(function*() {
  // Connect to the database
  var client = yield MongoClient.connect('mongodb://localhost:27017/db');
  // Insert a document
  var result = yield client.collection('test1').insertOne({a:1});
  // Get the documents
  var docs = yield client.collection('test1').find({}).toArray();
  // Close the connection
  yield client.close();
}).catch(function(err) {
  console.log(err.stack);
});
```

Pretty straightforward to use the library with the generator library `co` and ES6. To use your favorite Promise library simply do the following when requiring the module.

```js
var co = require('co')
  , Promise = require('bluebird')
  , MongoClient = require('mongodb-promisified')(Promise).MongoClient;
```

## Not Supported functions

Grid FS is not supported by this driver.

## Supported functions

The promisified wrapper supports most of the functionality of the 2.0 drivers but not all of it.

### Db class

The supported functions are.

#### Promisified

`close`
`command`
`createCollection`
`stats`
`eval`
`renameCollection`
`dropCollection`
`dropDatabase`
`collections`
`executeDbAdminCommand`
`addUser`
`removeUser`
`authenticate`
`logout`

#### Overridden

`collection`
`listCollections`
`db`

### Collection class

#### Promisified

`insertOne`
`insertMany`
`bulkWrite`
`updateOne`
`replaceOne`
`updateMany`
`deleteOne`
`deleteMany`
`save`
`findOne`
`rename`
`options`  
`createIndex`
`createIndexes`
`isCapped`
`dropIndex`
`dropIndexes`
`reIndex`
`ensureIndex`
`indexExists`
`indexInformation`
`indexes`
`count`
`distinct`
`stats`
`findOneAndDelete`
`findOneAndReplace`
`findOneAndUpdate`
`parallelCollectionScan`
`geoNear`
`geoHaystackSearch`
`group`
`mapReduce`
`drop`

#### Overridden

`find`
`aggregate`
`listIndexes`

## Cursor class

#### Promisified

`toArray`
`next`

#### Chainable

`filter`
`addCursorFlag`
`addQueryModifier`
`comment`
`maxTimeMS`
`maxTimeMs`
`project`
`sort`
`batchSize`
`limit`
`skip`

## AggregationCursor class

#### Promisified

`toArray`
`next`

#### Chainable

`batchSize`
`geoNear`
`group`
`limit`
`match`
`maxTimeMS`
`out`
`project`
`redact`
`skip`
`sort`
`unwind`