function Email(fakeFrom, fakeTo, cc, subject, body, isRead, realFrom, realTo, date, owner, isInbox) {
  this.fakeFrom = fakeFrom;
  this.fakeTo = fakeTo;
  this.cc = cc;
  this.subject = subject;
  this.body = body;
  this.isRead = isRead;
  this.realFrom = realFrom;
  this.realTo = realTo;
  this.date = date;

  this.owner = owner;
  this.isInbox = isInbox;
}

/*
* Display the emails dynamically.
* @param id       the id of the element where the emails should be displayed
* @param emails   an array of email objects
* @param isInbox  bool if the emails should respect isRead property (only
*                 respect bold when in inbox, otherwise always not bolded)
* @returns        NA
*/
function displayEmails(id, emails, isInbox) {
  // get and clear the element where the emails should be displayed
  var element = $("#" + id);
  element.html("");

  // look through each email and display
  for (var i = 0; i < Math.min(10, emails.length); i ++) {
    var email = emails[i];                    // the individual email
    var doBolding = !email.isRead && isInbox; // if the email should be bolded

    // create the content of the email to be displayed
    var content = '<div class="email">';

    // other person involved
    content += '<a class="'
      + (doBolding ? 'email_unread' : 'email_read') + '"'
      + 'onclick="viewMail(' + "'" + escape(JSON.stringify(email)) + "'" + ')">'
      + (isInbox ? email.fakeFrom : email.fakeTo) + '</a>';

    // subject
    content += '<a class="'
      + (doBolding ? 'email_unread' : 'email_read') + '"'
      + 'onclick="viewMail(' + "'" + escape(JSON.stringify(email)) + "'" + ')">'
      + email.subject + '</a>';

    content += '</div>';

    // delete button
    content += '<a class="btn deleteButton" onclick="deleteMail('
      + "'" + escape(JSON.stringify(email)) + "'" + ')">X</a>';

    // add the content to the element
    element.append(content);
  }
}

/*
* Sends an email from the compose.html page
* @returns    N/A
*/
function sendMail() {
  // get the fields from the compose page

  // no from found, must be from student or from found and take that
  var from = $("#email_from").length === 0 ? "student" : $("#email_from").val();
  var to = $("#email_to").val();
  var cc = $("#email_cc").val();
  var subject = $("#email_subject").val();
  var body = $("#email_body").val();

  // non-empty checks
  if (to.trim() === "" || subject.trim() === "" || body.trim() === "") {
    alert("You missed some information! \n"
      + "Check to make sure you have filled in: To, Subject, and Body \n"
      + "\n"
      + "For more help, click on the words To, Subject, and Body"
    );
    return;
  }
  if (from.trim() === "") {
    alert("You missed some information! \n"
      + "Check to make sure you have filled in: From \n"
    );
    return;
  }

  // create the email object
  // Email(fakeFrom, fakeTo, cc, subject, body, isRead, realFrom, realTo, date, owner, isInbox)
  var email = new Email(from, to, cc, subject, body, false,
    from === "student" ? "student" : "admin",   // if from is student, realFrom is student, otherwise admin
    from === "student" ? "admin" : "student",   // if from is student, realTo is admin, otherwise student
    (new Date()).getTime(),
    "",
    false
  );

  // save the email object to the sender's sent items
  email.owner = email.realFrom;
  email.isInbox = false;
  var sender = getAccount(email.realFrom);
  sender.sentMail.unshift(email);

  // save the email object to the recipient's inbox
  email.owner = email.realTo;
  email.isInbox = true;
  var recipient = getAccount(email.realTo);
  recipient.inboxMail.unshift(email);

  // save accounts if both have room for the email
  try {
    saveAccounts(sender, recipient);

    // redirect the sender to their sent mail
    goTo("sentitems.html");
  } catch (err) {
    alert(err.name + " " + err.message);
    return;
  }
}

/*
* Deletes an email.
* @param stringifiedEmail escape(JSON.stringify(some email)) version of the
*                         email you want to delete
* @returns NA
*/
function deleteMail(stringifiedEmail) {
  // the unescaped, parsed email represented by stringifiedEmail
  var email = JSON.parse(unescape(stringifiedEmail));

  // who should we delete the email from
  var account = getAccount(email.owner);

  if (email.isInbox) {
    // email is in inbox: delete through inbox
    for (var i = 0; i < account.inboxMail.length; i ++) {
      if (escape(JSON.stringify(account.inboxMail[i])) === stringifiedEmail) {
        account.inboxMail.splice(i, 1);
        i --;
      }
    }
  } else {
    // email is in sent mail: delete through sent mail
    for (var i = 0; i < account.sentMail.length; i ++) {
      if (escape(JSON.stringify(account.sentMail[i])) === stringifiedEmail) {
        account.sentMail.splice(i, 1);
        i --;
      }
    }
  }

  saveAccount(account); // save the new state of the account
  location.reload();    // reload the page to update the email list
}

/*
* Views a specific (1)stringified and (2)escaped email.
* Sets all pre-conditions for the loadMail() method which will be called when
* we change the window's location to email.html.
* @param stringifiedEmail  the stringified and escaped email to view
* @returns                 NA
*/
function viewMail(stringifiedEmail) {
  // the unescaped, parsed email represented by stringifiedEmail
  var email = JSON.parse( unescape(stringifiedEmail) );

  // set the storage to display the right email
  try {
    localStorage.setItem("displayEmail", JSON.stringify(email));
  } catch (error) {
    console.error("Could not save displayEmail for viewing mail");
  }

  // set email to be read
  if (!email.isRead) {
    var account = getAccount(email.owner);
    for (var i = 0; i < account.inboxMail.length; i ++) {
      if (JSON.stringify(email) === JSON.stringify(account.inboxMail[i])){
        account.inboxMail[i].isRead = true;
        break;
      }
    }
    saveAccount(account);
  }

  // open the email.html page
  goTo("email.html");
}

/*
* Loads the stored email information into the fields on the page.
* If no email is found, go back.
* If the owner of the email is no longer signed in, do not display the email!
* @returns  NA
*/
function loadMail() {
  if (typeof (window.Storage) === "undefined"){
		// storage not supported by browser
    console.error("Storage is not supported by this browser");
    goBack();
    return;
  } else if (localStorage.getItem("displayEmail") == null){
	   // nothing stored at that key
     console.error("No email to display.")
     goBack();
     return;
  } else {
    // result successfully found
    var email = JSON.parse(localStorage.getItem("displayEmail"));

    // load the email
    if (email.isInbox) {
      // INBOX ITEM
      $("#title").html("VIEWING INBOX ITEM");
      $("#non_owner_type").html("From");
      $("#non_owner").html(email.fakeFrom);
    } else {
      // SENT ITEM
      $("#title").html("VIEWING SENT ITEM");
      $("#non_owner_type").html("To");
      $("#non_owner").html(email.fakeTo);
    }

    $("#email_cc").html(email.cc);
    $("#email_subject").html(email.subject);
    $("#email_body").html(email.body);
  }
}

class MailSaveError extends Error {
  constructor(message) {
    super(message);
    this.name = "MailSaveError";
  }
}

function reviewMail() {
  window.open("../help/emailreview.html", "_blank", "width=500, height=200, left=300, top=250");
}
