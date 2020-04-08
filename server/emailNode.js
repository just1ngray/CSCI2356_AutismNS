/*
* DESCRIPTION HERE
*
* @author Jay Patel
* @author Justin Gray
* @author Vitor Jeronimo
*/

// ==========================================================================
// Server Setup
// ==========================================================================

var express = require("express");
var server = express();
var MongoClient = require("mongodb").MongoClient;

var PORT = 3355;
var URL = 'mongodb://jp_gray:A00426753@127.0.0.1:27017/jp_gray';

server.use(express.json());
server.use(express.urlencoded({
  extended: true
}));

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

// ==========================================================================
// Server Functionality
// ==========================================================================

server.listen(PORT, function() {
  console.log('Now listening for activity on port ' + PORT);
});

// DESCRIPTION HERE
server.post("/getAccount", function(req, res) {
  // get the account object from the mongodb
  MongoClient.connect(URL, function(err, db) {
    if (err) throw err;

    var accName = req.body.name;
    console.log('Request received to get account: ' + accName);

    var dbo = db.db('jp_gray');
    dbo.collection('accounts').findOne({name: accName}, function(err, result) {
      if (err) throw err;

      // no document found
      if (result == null) {
        result = {
          _id: accName,
          name: accName,
          inboxMail: [],
          sentMail: []
        };
        console.log('No document in accounts by the name ' + accName
          + ' creating an empty account');

        dbo.collection('accounts').insertOne(result, function(err, res) {
          if (err) throw err;
          console.log('Inserted account ' + accName + ' into accounts')
        });
      } else {
        // empty arrays are not stored in mongo so they have to be added later
        if (result.inboxMail == null) {
          result.inboxMail = [];
        }
        if (result.sentMail == null) {
          result.sentMail = [];
        }
        console.log('Found ' + result.name + ' in accounts');
      }
      db.close();
      return res.status(200).send(result);
    });
  });
});

// DESCRIPTION HERE
server.post("/writeAccount", function(req, res) {
  // get the account object from the mongodb
  MongoClient.connect(URL, function(err, db) {
    if (err) throw err;

    var accName = req.body.name;
    console.log('WRITING: ' + accName);

    var dbo = db.db('jp_gray');
    dbo.collection('accounts').replaceOne({
        name: accName
      }, req.body, function(err, result) {

      if (err) throw err;
      console.log('Updated account ' + accName + ' in accounts');
      db.close();
      return res.status(200).send();
    });
  });
});
