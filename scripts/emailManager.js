/*
* Gets an account stored in local storage.
* If no account is found under that name, it returns an empty account of that
* name.
* @param name the name of the account (must be unique)
* @returns    the account in storage (or a blank new account if none found)
*/
function getAccount(name) {
  if (typeof (window.Storage) === "undefined"){
		// storage not supported by browser
    console.log("Error: Storage is not supported by this browser.");
  } else if (localStorage.getItem(name) == null){
	   // nothing stored at that key
     console.log("New account for " + name);
     return new Account(name, [], []);
  } else {
    // result successfully found
    console.log("Found data for " + name);
    return JSON.parse(localStorage.getItem(name));
  }
}

/*
* Saves an account to local storage.
* @param account  the account to save to local storage
* @returns        N/A
*/
function saveAccount(account) {
  console.log("Saving " + account.name);
  if (account.name == null || typeof account.name != "string") {
    console.log("Error: Invalid account");
  } else {
    try {
      localStorage.setItem(account.name, JSON.stringify(account));
      console.log("Saved " + account.name);
    } catch (error) {
      console.log("Error: Could not save " + account.name + ". " + error.name
        + ": " + error.message);
    }
  }
}

/*
* Creates a new account object (for either admin or student)
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

/*
* Creates a new email object.
*
* USAGE:
* var testEmail = new Email(somedate, "From@Me.com", "To@You.ca", "",
*   "This is a TEST!", "Hi, did it work?", false);
* console.log(testEmail.from);
* PRINTS: From@Me.com
*
* @param date     when the email was sent (number of milliseconds since
*   1970/01/01. Use ( (new Date()).getTime() )
* @param from     the sender of the email (string)
* @param to       the recipient of the email (string)
* @param cc       any other recipients (string)
* @param subject  the subject of the email (string)
* @param body     body of the email message (string)
* @param isRead   if the email has been read (bool)
* @param owner    the owner of the email
* @returns        the new email object
*/
function Email(date, from, to, cc, subject, body, isRead, owner) {
  this.date = date;
  this.from = from;
  this.to = to;
  this.cc = cc;
  this.subject = subject;
  this.body = body;
  this.isRead = isRead;
  this.owner = owner;

  // TODO: Add other information (isFlagged, etc.)?
}

/*
* Display the emails dynamically.
* @param id       the id of the element where the emails should be displayed
* @param emails   an array of email objects
* @param isInbox  bool if the emails should respect isRead property (only
*                 respect bold when in inbox, otherwise always not bolded)
* @returns        N/A
*/
function displayEmails(id, emails, isInbox) {
  // get and clear the element where the emails should be displayed
  var element = $("#" + id);
  element.html("");

  // look through each email and display
  for (var i = 0; i < emails.length; i ++) {
    var email = emails[i];  // the individual email
    var doBolding = !email.isRead && isInbox; // if the email should be bolded

    // create the content of the email to be displayed
    var content = '<div class="email">'; // TODO: add onclick="something()" that links to an email

    content += '<a class="'
      + (doBolding ? 'email_unread' : 'email_read') + '">'
      + (isInbox ? email.from : email.to) + '</a>';

    content += '<a class="'
      + (doBolding ? 'email_unread' : 'email_read') + '">'
      + email.subject + '</a>';

    //content += '<a class="btn deleteButton" onclick="deleteMail()">X</a>';
    content += '<a class="btn deleteButton" onclick="deleteMail(' + email.owner + ',' + email.date + ')">X</a>';

    content += '</div>';

    // add the content to the element
    element.append(content);
  }
}

// function addInboxEmail() {
//   var student = getAccount("student");
//   var email = new Email((new Date()).getTime(),"Charli@tbd.com",
//     "Student@???.ca", "na-cc", "Welcome to Autism NS", "Hi student," +
//     "welcome to the email server.", true);
//
//   student.inboxMail.push(email);
//   saveAccount(student);
// }

/*
* Sends an email from the compose.html page
* @param from the sender of the email
* @returns    N/A
*/
function sendMail(from) {
console.log("1");

  // get the fields from the compose page
  var to = $("#email_to").val();
  var cc = $("#email_cc").val();
  var subject = $("#email_subject").val();
  var body = $("#email_body").val();

console.log("2");

  // create the email object
  var email = new Email( (new Date()).getTime(), from, to, cc, subject, body,
    false, "");

  // save the email object to the sender's sent items
  email.owner = from;
  var sender = getAccount(from);
  sender.sentMail.push(email);
  saveAccount(sender);

console.log("3");

  // save the email object to the recipient's inbox
  email.owner = to;
  var recipient = getAccount(to);
  recipient.inboxMail.push(email);
  saveAccount(recipient);

console.log("4");

  // redirect the sender to their sent mail
  window.location = "sentitems.html";

console.log("5");
}

function deleteMail(owner, emailDateMillis) {
  var account = getAccount(owner);

  account.inboxMail = [];
  account.sentMail = [];

  for (var i = 0; i < account.inboxMail.length; i ++) {
    if (account.inboxMail[i].date == emailDateMillis) {
      account.inboxMail.splice(i, 1);
      i --;
    }
  }
  for (var i = 0; i < account.sentMail.length; i ++) {
    if (account.sentMail[i].date == emailDateMillis) {
      account.sentMail.splice(i, 1);
      i --;
    }
  }

  saveAccount(account);
  location.reload();
}
