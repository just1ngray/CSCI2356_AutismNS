/*
* This file manages emails in our email system. Emails are created, sent,
* displayed, and deleted from this file.
*
* @author Justin Gray (A00426753)
* @author Vitor Jeronimo
* @author Jay Patel
*/

/*
* Create an email object. Note realFrom vs. fakeFrom allows for admins to send
* mail as other aliases (i.e. professors)
*
* @param fakeFrom the displayed 'from' person
* @param fakeTo   the displayed 'to' person
* @param cc       anyone copied to the email (no functionality)
* @param subject  the subject of the email
* @param body     the body of the email
* @param isRead   if the email has been read
* @param realFrom who is this email really from (student/admin)
* @param realTo   who is this email really to (student/admin)
* @param date     time of when the email was created
* @param owner    the owner of this email (string name link to account)
* @param isInbox  if this email is in an inbox and respects isRead properties
* @returns        the new email object
*/
function Email(fakeFrom, fakeTo, cc, subject, body, isRead, realFrom, realTo,
  date, owner, isInbox) {

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
* @param isInbox  bool if the emails are a part of an inbox
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

* Deletes an email.
* @param stringifiedEmail escape(JSON.stringify(some email)) version of the
*                         email to delete
* @returns                NA
*/
function deleteMail(stringifiedEmail) {
  // the unescaped, parsed email represented by stringifiedEmail
  // aka the email object
  var email = JSON.parse(unescape(stringifiedEmail));

  // which account is the email being deleted from
  var account = getAccount(email.owner);

  if (email.isInbox) {
    // email is in inbox: delete through inbox
    for (var i = 0; i < account.inboxMail.length; i ++) {
      // date is the unique identifier
      if (account.inboxMail[i].date === email.date) {
        account.inboxMail.splice(i, 1);
        i --;
      }
    }
  } else {
    // email is in sent mail: delete through sent mail
    for (var i = 0; i < account.sentMail.length; i ++) {
      // date is the unique identifier
      if (account.sentMail[i].date === email.date) {
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
    // save the new state of the account (with the read email)
    saveAccount(account);
  }

  // open the email.html page
  goTo("email.html");
}

/*
* Loads the stored email information into the fields on the page.
* If no email is found, go back.
* Preconditions for proper use: an email is stored at displayEmail in
* localStorage
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

/*
* Handles when mail cannot be saved due to oversized inbox/sent mail.
*/
class MailSaveError extends Error {
  constructor(message) {
    super(message);
    this.name = "MailSaveError";
  }
}

/*
* Compose.html's send button calls this function. It creates a replica sent mail
* page that shows all entered information (to,cc,sub,body), and asks questions.
*/
function sendPreview() {
  // retrieve field data from the page
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
  try {
    localStorage.setItem("emailToSend", JSON.stringify(email));
    localStorage.setItem("displayEmail", JSON.stringify(email));
  } catch (err) {
    console.log(err.message);
  }

  // save the email object to the recipient's inbox
  email.owner = email.realTo;
  email.isInbox = true;
  try {
    localStorage.setItem("emailToRecieve", JSON.stringify(email));
  } catch (err) {
    console.log(err.message);
  }

  // redirect to the emailReview.html page to review the email
  goTo("emailReview.html");
}

/*
* Sends an email given data set in emailToRecieve and emailToSend localStorage.
* Called on emailReview.html page.
*/
function confirmSend() {
  // retrieve the emails from storage
  var emailRecieve = JSON.parse(localStorage.getItem("emailToRecieve"));
  var emailSend = JSON.parse(localStorage.getItem("emailToSend"));

  // save the email object to the sender's sent items
  var sender = getAccount(emailSend.owner);
  sender.sentMail.unshift(emailSend);

  // save the email object to the recipient's inbox
  var recipient = getAccount(emailRecieve.owner);
  recipient.inboxMail.unshift(emailRecieve);

  // save accounts if both have room for the email
  try {
    saveAccounts(sender, recipient);

    // redirect the sender to their sent mail
    goTo("sentitems.html");
  } catch (err) {
    // someone had too little space to store the email: send a message
    // accordingly
    alert(err.message);
    return;
  }
}

/*
* Confirms before sending, deleting, canceling
* @returns  true if the user clicked "OK", and false otherwise and performs
*           respective event
*/
function confirmation(id) {

  // depending on the id, display appropriate dialog box
  switch (id) {

    case "cancel":
      if (confirm("Are you sure that you want to cancel? All the changes in "
        + "this email will be lost.")) {
        goBack();
      }
      break;

    //This case is not yet completed as we have to show a confirmation page
    //before sending
    case "delete":
      if (confirm("Are you sure that you want to delete this email?")) {

      }
      break;

  }
}
