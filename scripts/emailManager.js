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
     return new Account(name, [], []);
  } else {
    // result successfully found
    return JSON.parse(localStorage.getItem(name));
  }
}

/*
* Saves an account to local storage.
* @param account  the account to save to local storage
* @returns        N/A
*/
function saveAccount(account) {
  if (account.name == null || typeof account.name != "string") {
    console.log("Error: Invalid account");
  } else {
    try {
      localStorage.setItem(account.name, JSON.stringify(account));
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
* @returns        the new email object
*/
function Email(date, from, to, cc, subject, body, isRead) {
  this.date = date;
  this.from = from;
  this.to = to;
  this.cc = cc;
  this.subject = subject;
  this.body = body;
  this.isRead = isRead;

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
  var element = $("#" + id);
  element.html("");

  for (var i = 0; i < emails.length; i ++) {
    var email = emails[i];

    var content = '<div class="email" onclick="inboxItem(' + email.name + ')">';

    content += '<a class="'
      + (isInbox && email.isRead ? 'email_read' : 'email_unread') + '">'
      + (isInbox ? email.from : email.to) + '</a>';

    content += '<a class="'
      + (isInbox && email.isRead ? 'email_read' : 'email_unread') + '">'
      + email.subject + '</a>';

    content += '</div>';

    element.append(content);
  }

  /*<div class="email" onclick="inboxItem()">
    <a class="email_unread">Terence.Goldsmith@smu.ca</a>
    <a class="email_unread">Touching Base</a>
  </div>*/
}

// for testing purposes only
/*function printAcc() {
  var sentAMail01 = new Email((new Date()).getTime(),"Justin@gmail.com",
    "Terry@Goldsmith.ca", "na-cc", "This is a Test!", "Hi terry, I am testing" +
    "stuff right now, Justin", false);
  var sentAMail02 = new Email((new Date()).getTime()+1,"Justin@gmail.com",
    "Terry@Goldsmith.ca", "na-cc", "Oops!", "Hi terry, I meant to attach" +
    "the files. Here they are. Justin", false);
  var acc = new Account("Justin", [], [sentAMail01, sentAMail02]);
  console.log( JSON.stringify(acc) );
  console.log((typeof acc.name));
}*/

function addInboxEmail() {
  var student = getAccount("student");
  var email = new Email((new Date()).getTime(),"Charli@tbd.com",
    "Student@???.ca", "na-cc", "Welcome to Autism NS", "Hi student," +
    "welcome to the email server.", true);

  student.inboxMail.push(email);
  saveAccount(student);
}
