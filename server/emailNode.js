var express = require("express");
var server = express();
var PORT = 3355;

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

server.post("/account", function(req, res) {
  var accName = req.body.name;
  console.log('Request received for account ' + accName);
  // get all emails (sorted by date) from mongo db collection by accName

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

  var account = {
    name: accName,
    inboxMail: [fakeIn],
    sentMail: [fakeOut]
  };

  return res.status(200).send(account);
});
