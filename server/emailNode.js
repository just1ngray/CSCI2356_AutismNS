var express = require("express");
var server = express();
var MongoClient = require("mongodb").MongoClient;

var PORT = 3355;
var URL = 'mongodb://jp_gray:A00426753@127.0.0.1:27017/jp_gray';

server.use(express.json());
server.use(express.urlencoded({
  extended: true
}));

// still not sure what these do...
server.use('/scripts', express.static(__dirname + '/scripts'));
server.use('/css', express.static(__dirname + '/css'));
server.use(express.static(__dirname));

var allowCrossDomain = function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
}
server.use(allowCrossDomain);

server.listen(PORT, function() {
  console.log('Now listening for activity on port ' + PORT);
});

server.post("/getAccount", function(req, res) {
  var accName = req.body.name;
  console.log('Request received to get account: ' + accName);

  // get the account object from the mongodb
  MongoClient.connect(URL, function(err, db) {
    if (err) throw err;
    var dbo = db.db('jp_gray');
    dbo.collection('accounts').findOne({name: accName}, function(err, result) {
      if (err) throw err;

      // no document found
      if (result == null) {
        result = {
          name: accName,
          inboxMail: [],
          sentMail: []
        };
        console.log('No document in accounts by the name ' + accName
          + ' creating an empty account');
      } else {
        console.log('Found ' + result.name + ' in accounts');
      }
      db.close();
      return res.status(200).send(result);
    });
  });
});

server.post("/writeAccount", function(req, res) {
  var accName = req.body.name;
  console.log('Request received to write account: ' + accName);

  // get the account object from the mongodb
  MongoClient.connect(URL, function(err, db) {
    if (err) throw err;
    var dbo = db.db('jp_gray');
    dbo.collection('accounts').replaceOne({name: accName}, req.body,
      {upsert: true}, function(err, result) {

      if (err) throw err;
      console.log('Updated account ' + accName + ' in accounts');
      db.close();
      return res.status(200);
    });
  });
});

var fakeIn = {
  fakeFrom: "professor@smu.ca",
  fakeTo: "student@smu.ca",
  cc: "The rest of the class!",
  subject: "COVID19 Response",
  body: "You all fail. Muhahah!",
  isRead: false,
  realFrom: "admin",
  realTo: "student",
  date: (new Date()).getTime(),
  owner: "student",
  isInbox: true
}

var fakeOut = {
  fakeFrom: "student",
  fakeTo: "McDonalds@ImHungry.com",
  cc: "",
  subject: "Can I has Cheeseburger?",
  body: "Please, could I please pls has Cheeseburger?!",
  isRead: false,
  realFrom: "student",
  realTo: "admin",
  date: (new Date()).getTime(),
  owner: "student",
  isInbox: false
}

var testAccount = {
  name: 'testAccount',
  inboxMail: [fakeIn],
  sentMail: [fakeOut]
};

// inserts into a collection
// MongoClient.connect(URL, function(err, db) {
//   if (err) throw err;
//   var dbo = db.db('jp_gray');
//   dbo.collection('accounts').insertOne(testAccount, function(err, res) {
//     if (err) throw err;
//     console.log('Account (' + testAccount.name + ') inserted!');
//     db.close();
//   });
// });

// creates a collection
// MongoClient.connect(URL, function(err, db) {
//   if (err) throw err;
//   var dbo = db.db('jp_gray');
//   dbo.createCollection('accounts', function(err, res) {
//     if (err) throw err;
//     console.log('Collection created!');
//     db.close();
//   });
// });
