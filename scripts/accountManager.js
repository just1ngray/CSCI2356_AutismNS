/*
* This file manages accounts in our email system. This account method is better
* than storing individual hardcoded arrays since this system would be able to
* handle many accounts without much modification. Room for expansion is
* important.
*
* @author Jay Patel
* @author Justin Gray
* @author Vitor Jeronimo
*/

/*
* Creates a new account object (for either admin or student or other?)
*
* USAGE:
* var testAcc = new Account("Tester", [], []);
* console.log(testAcc.name);
* PRINTS: Tester
*
* @param name       the owner of the account (string)
* @param inboxMail  an array of Email objects (sent to this Account)
* @param sentMail   an array of Email objects (sent from this Account)
* @returns          a new account object
*/
function Account(name, inboxMail, sentMail) {
  this.name = name;
  this.inboxMail = inboxMail;
  this.sentMail = sentMail;
}

// ==========================================================================
// I/O Methods to Persistent Storage
// ==========================================================================

// the URL for the server ugdev.cs.smu.ca at our chosen port
var SERVER_URL = "http://140.184.230.209:3384";

/*
* Reads data from local storage by a key.
* @param key  where the the item is in local storage
* @returns    the item at key in local storage
*/
function read(key) {
  if (typeof (window.Storage) === "undefined"){
		// storage not supported by browser
    return "undefined";
  } else {
    // return null or the found value
    return localStorage.getItem(key);
  }
}

/*
* Writes data into local storage using a key value pair. Value is written at
* location key. Just like a map.
* @param key    where to store the value
* @param value  the value to store
*/
function write(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.error(error.name + ": " + error.message);
  }
}

/*
* Get a server account by name, and perform a function on the returned account
* @param accountName  the name of the account to retrieve from server storage
* @param next         the function to perform next (with the account object)
* @returns            NA
*/
function getServerAccount(accountName, next) {
  $.post(SERVER_URL + '/getAccount', {name: accountName}, function(result) {
    // using the account result object, perform 'next' function
    if (next != null) {
      next(result)
    }
  }).fail(function(err) {
    // if we have an error, print an error message
    console.error(err);
  });
}

/*
* Save an account to server storage and optionally perform the next operation
* @param account  the account to save to server storage
* @param next     the function to perform once the account has been saved. null
*                 if there is no function to perform, otherwise passes account
* @returns        NA
*/
function saveServerAccount(account, next) {
  $.post(SERVER_URL + '/writeAccount', account, function() {
    if (next != null) {
      // perform the 'next' function and pass the account object
      next(account);
    }
  }).fail(function(err) {
    // if we have an error, print a message and tell the user of the website
    console.error(err);
  });
}

const MAX_EMAILS = 10; // the size of an account's inbox and sent mail (each)

/*
* Ensure that both the sender and recipient have room for the email before
* starting to compose it! If no room, alert and redirect back.
* @param sender     the sender account's name
* @param recipient  the recipient account's name
* @returns          NA
*/
function checkHasRoom() {
  // checkHasRoom requires a sender and a recipient: hardcoded for the
  // purpose of this project, but could be abstracted further
  var sender = window.location.href.includes("student") ? "student" : "admin";
  var recipient = (sender == "student") ? "admin" : "student";

  // first, check if the recipient has space in inbox (req8e)
  getServerAccount(recipient, function(recipientAcc) {
    if (recipientAcc.inboxMail.length >= MAX_EMAILS) {
      alert("Recipient's inbox is full.");
      goBack(null, true);
    } else {
      // next, check if the sender has sent items room (req8f)
      getServerAccount(sender, function(senderAcc) {
        if (senderAcc.sentMail.length >= MAX_EMAILS) {
          alert("Your sent items is full.");
          goBack(null, true);
        }
      });
    }
  });
}
