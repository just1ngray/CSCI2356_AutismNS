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

function saveAccounts(sender, recipient) {
  if (recipient.inboxMail.length > 10) {
    throw new MailSaveError("Their inbox is full!\n"
      + "They need to delete some emails to make room.");
  }
  if (sender.sentMail.length > 10) {
    throw new MailSaveError("Your sent mail is full!\n"
      + "You need to delete some emails to make room.");
  }
  saveAccount(sender);
  saveAccount(recipient);
}

/*
* Saves an account to local storage.
* @param account  the account to save to local storage
* @returns        N/A
*/
function saveAccount(account) {
  // caps insensitive: easier sign-in
  account.name = account.name.toLowerCase();

  // sort inbox in descending order by date (newest at top)
  account.inboxMail = account.inboxMail.sort(
    function(a, b) {
      return b.date - a.date;
    }
  );
  // inbox too big error
  if (account.inboxMail.length > 10) {
    throw new MailSaveError(account.name + "'s inbox is full!\n"
      + "Could not save account.");
  }

  // sort sent mail in descending order by date (newest at top)
  account.sentMail = account.sentMail.sort(
    function(a, b) {
      return b.date - a.date;
    }
  );
  // sentMail too big error
  if (account.sentMail.length > 10) {
    throw new MailSaveError(account.name + "'s sent mail is full!\n"
      + "Could not save account.");
  }

  // save
  if (account.name == null || typeof account.name != "string") {
    console.error("Invalid account");
  } else {
    write(account.name, account);
  }
}

/*
* Gets an account stored in local storage.
* If no account is found under that name, it returns an empty account of that
* name.
* @param name the name of the account (must be unique)
* @returns    the account in storage (or a blank new account if none found)
*/
function getAccount(name) {
  var acc = read(name);
  if (acc === "undefined"){
		// storage not supported by browser
  } else if (acc == null) {
	   // nothing stored at that key
     return new Account(name, [], []);
  } else {
    // result successfully found
    return acc;
  }
}
