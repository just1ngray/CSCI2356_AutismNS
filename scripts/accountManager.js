/*
* This file manages accounts in our email system. This account method is better
* than storing individual hardcoded arrays since this system would be able to
* handle many accounts without much modification. Room for expansion is
* important.
*
* @author Justin Gray
* @author Vitor Jeronimo
* @author Jay Patel
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

/*
* Saves an account.
* @param account        the account to save
* @throws MailSaveError if one or both of their boxes is full
* @returns              NA
*/
function saveAccount(account) {
  // caps insensitive
  account.name = account.name.toLowerCase();

  // sort inbox in descending order by date (newest at top)
  account.inboxMail = account.inboxMail.sort(
    function(a, b) {
      return b.date - a.date;
    }
  );

  // sort sent mail in descending order by date (newest at top)
  account.sentMail = account.sentMail.sort(
    function(a, b) {
      return b.date - a.date;
    }
  );

  // save
  if (account.name == null || typeof account.name != "string") {
    console.error("Invalid account");
  } else {
    write(account.name, JSON.stringify(account));
  }
}

/*
* Gets an account.
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
    return JSON.parse(acc);
  }
}
