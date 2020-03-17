/*
* This file manages emails in our email system. Emails are created, sent,
* displayed, and deleted from this file.
*
* @author Justin Gray
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
  for (var i = 0; i < emails.length; i ++) {
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
      if (email.date === account.inboxMail[i].date){
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
* Sends an email (from elements on the page)
* @returns  NA
*/
function send() {
  // if the sender of the email is the student account
  var isStudentSender = $("#email_from").length === 0;

  // retrieve field data from the page
  var from = isStudentSender ? "student" : $("#email_from").val();
  var to = $("#email_to").val();
  var cc = $("#email_cc").val();
  var subject = $("#email_subject").val();
  var body = $("#email_body").val();

  // non-empty checks
  // if (to.trim() === "" || subject.trim() === "" || body.trim() === "") {
  //   alert("You missed some information! \n"
  //     + "Check to make sure you have filled in: To, Subject, and Body \n"
  //     + "\n"
  //     + "For more help, click on the words To, Subject, and Body"
  //   );
  //   return;
  // }
  // if (from.trim() === "") {
  //   alert("You missed some information! \n"
  //     + "Check to make sure you have filled in: From \n"
  //   );
  //   return;
  // }

  // create the email object
  // Email(fakeFrom, fakeTo, cc, subject, body, isRead, realFrom, realTo, date,
  //   owner, isInbox)
  var email = new Email(from, to, cc, subject, body, false,
    isStudentSender ? "student" : "admin",                // realFrom
    isStudentSender === "student" ? "admin" : "student",  // realTo
    (new Date()).getTime(),
    "",
    false
  );

  // save the email object to the sender's sent items
  email.owner = email.realFrom;
  email.isInbox = false;
  var sender = getAccount(email.owner);
  sender.sentMail.unshift(email);
  saveAccount(sender);

  // save the email object to the recipient's inbox
  email.owner = email.realTo;
  email.isInbox = true;
  var recipient = getAccount(email.owner);
  recipient.inboxMail.unshift(email);
  saveAccount(recipient);

  goTo("sentitems.html");
}
