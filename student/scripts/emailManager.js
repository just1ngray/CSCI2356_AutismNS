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
      + (isInbox ? email.from : email.to) + '</a>';

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
  var from = getSignedInAccount();

  // get the fields from the compose page
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

  // create the email object
  var email = new Email( (new Date()).getTime(), from, to, cc, subject, body,
    false, "");

  // save the email object to the sender's sent items
  email.owner = from;
  var sender = getAccount(from);
  sender.sentMail.push(email);
  saveAccount(sender);

  // save the email object to the recipient's inbox
  email.owner = to;
  var recipient = getAccount(to);
  recipient.inboxMail.push(email);
  saveAccount(recipient);

  // redirect the sender to their sent mail
  goTo("sentitems.html");
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

  // get the current account state of the owner
  var account = getAccount(email.owner);

  if (email.owner === email.to) {
    // email is in inbox: delete through inbox if found
    for (var i = 0; i < account.inboxMail.length; i ++) {
      if (escape(JSON.stringify(account.inboxMail[i])) === stringifiedEmail) {
        account.inboxMail.splice(i, 1);
        i --;
      }
    }
  } else if (email.owner === email.from) {
    // email is in sent mail: delete through sent mail if found
    for (var i = 0; i < account.sentMail.length; i ++) {
      if (escape(JSON.stringify(account.sentMail[i])) === stringifiedEmail) {
        account.sentMail.splice(i, 1);
        i --;
      }
    }
  } else {
    console.error("Owner was not a member of the email. Cannot delete.");
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

    // pass check if: signed-in user is the owner of the email to display
    if (!(email.owner === getSignedInAccount())) {
      console.error("Owner of the email not signed in");
      goBack();
      return;
    }

    // load the email once the page has finished loading
    $(document).ready(function() {
      if (email.owner === email.to) {
        // INBOX ITEM
        $("#title").html("VIEWING INBOX ITEM");
        $("#non_owner_type").html("From");
        $("#non_owner").html(email.from);

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
      } else if (email.owner === email.from) {
        // SENT ITEM
        $("#title").html("VIEWING SENT ITEM");
        $("#non_owner_type").html("To");
        $("#non_owner").html(email.to);
      } else {
        console.error("Owner of email was not sender or recipient")
        goBack();
        return;
      }

      $("#email_cc").html(email.cc);
      $("#email_subject").html(email.subject);
      $("#email_body").html(email.body);
    });
  }
}
