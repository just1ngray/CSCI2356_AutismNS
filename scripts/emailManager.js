/*
* This file manages emails in our email system. Emails are created, sent,
* displayed, and deleted from this file.
*
* @author Jay Patel
* @author Justin Gray
* @author Vitor Jeronimo
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
* Displays an account's specified mailbox
* @param id           the element's id where to display the list of emails
* @param accountName  the name of the account to display (student/admin)
* @param boxName      the name of the mailbox to display (inbox/sent)
* @returns            NA
*/
function displayMailbox(id, accountName, boxName) {
  // get and clear the element where we want to display the mailbox
  var element = $("#" + id);
  element.html("");

  getServerAccount(accountName, function(account) {
    console.log(account);

    // retrieve the email array (as emails()) for the account by boxName
    var emails = function() {
      if (boxName.toLowerCase().includes("inbox")) {
        return account.inboxMail;
      } else if (boxName.toLowerCase().includes("sent")
                || boxName.toLowerCase().includes("send")) {
        return account.sentMail;
      } else {
        console.error(accountName + " did not have a mail box by the name of "
          + boxName);
      }
    }

    // for each retrieved email, add it to the website
    for (var i = 0; i < emails().length; i ++) {
      var email = emails()[i];
      element.append( formatHTMLEmail(email) );
    }
  });
}

/*
* Formats an email into a html string for list-view displayed
* @param email  the email to format into a html string
* @returns      the formatted email as a html string
*/
function formatHTMLEmail(email) {
  // if the email should be bolded
  var doBolding = !email.isRead && email.isInbox;

  // create the content of the email to be displayed
  var content = '<div class="email">';

  // other person involved
  content += '<a class="'
    + (doBolding ? 'email_unread' : 'email_read') + '"'
    + 'onclick="viewMail(' + "'" + escape(JSON.stringify(email)) + "'" + ')">'
    + (email.isInbox ? email.fakeFrom : email.fakeTo) + '</a>';

  // subject
  content += '<a class="'
    + (doBolding ? 'email_unread' : 'email_read') + '"'
    + 'onclick="viewMail(' + "'" + escape(JSON.stringify(email)) + "'" + ')">'
    + email.subject + '</a>';

  content += '</div>';

  // delete button
  content += '<a class="btn deleteButton" onclick="deleteMail('
    + "'" + escape(JSON.stringify(email)) + "'" + ')">X</a>';

  return content;
}

/*
* Deletes an email.
* @param stringifiedEmail escape(JSON.stringify(some email)) version of the
*                         email to delete
* @returns                NA
*/
function deleteMail(stringifiedEmail) {
  // option to cancel deleting the email
  if (!confirm("Are you sure you want to delete this email?")) {
    return;
  }

  // the unescaped, parsed email represented by stringifiedEmail
  // aka the email object
  var email = JSON.parse(unescape(stringifiedEmail));

  // which account is the email being deleted from
  getServerAccount(email.owner, function(account) {
    // remove the email from whichever mailbox it is stored inside
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

    saveServerAccount(account, function() {
      // reload the page after the email has been deleted
      location.reload(true);
    });

  });
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
    getServerAccount(email.owner, function(account) {
      for (var i = 0; i < account.inboxMail.length; i ++) {
        if (email.date === account.inboxMail[i].date){
          account.inboxMail[i].isRead = true;
          break;
        }
      }
      // save the new state of the account (with the read email)
      saveServerAccount(account);
    });
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
  // confirm send (and opportunity to cancel!)
  if (!confirm(
    "1) Is everything spelled correctly? \n"
    + "\n"
    + "2) Did you use full sentences? \n"
    + "\n"
    + "3) Is the email addressed to the correct person? \n"
    + "\n"
    + "4) Did you sign your name at the end of the email?"
  )) {
    return;
  }

  // if the sender of the email is the student account
  var isStudentSender = window.location.href.includes('student');

  // retrieve field data from the page
  var from = isStudentSender ? "student" : $("#email_from").val();
  var to = $("#email_to").val();
  var cc = $("#email_cc").val();
  var subject = $("#email_subject").val();
  var body = $("#email_body").val();

  // if admin left from field blank
  if (!isStudentSender && from.length == 0) {
    alert('"From" field is blank.');
    return;
  }

  // create the email object
  // Email(fakeFrom, fakeTo, cc, subject, body, isRead, realFrom, realTo, date,
  //   owner, isInbox)
  var email = new Email(from, to, cc, subject, body, false,
    isStudentSender ? "student" : "admin",  // realFrom
    isStudentSender ? "admin" : "student",  // realTo
    (new Date()).getTime(),
    "",
    false
  );

  // save the email object to the recipient's inbox
  getServerAccount(email.realTo, function(account) {
    email.owner = email.realTo;
    email.isInbox = true;
    account.inboxMail.unshift(email);
    saveServerAccount(account);
  });

  // save the email object to the sender's sent items
  getServerAccount(email.realFrom, function(account) {
    email.owner = email.realFrom;
    email.isInbox = false;
    account.sentMail.unshift(email);
    saveServerAccount(account);
    goTo("sentitems.html");
  });
}
