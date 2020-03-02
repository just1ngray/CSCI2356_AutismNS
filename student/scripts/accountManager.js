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
    try {
      localStorage.setItem(account.name, JSON.stringify(account));
    } catch (error) {
      console.error("Could not save " + account.name + ". " + error.name
        + ": " + error.message);
    }
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
  if (typeof (window.Storage) === "undefined"){
		// storage not supported by browser
    console.error("Storage is not supported by this browser");
  } else if (localStorage.getItem(name.toLowerCase()) == null){
	   // nothing stored at that key
     return new Account(name, [], []);
  } else {
    // result successfully found
    return JSON.parse(localStorage.getItem(name.toLowerCase()));
  }
}

/*
* Creates a sign-in form at any given id.
* @param id the id to create the sign-in form at
* @returns  NA
*/
function addSignIn(id) {
  var element = $("#" + id);

  // ugly but functional: needs to be styled
  var content = '<form class="signin">';
  content += '<mylabel>Email Address:</mylabel>';
  content += '<input type="email" id="username" value="'
    + getSignedInAccount() + '">'
  content += '<input type="submit" value="Sign-In" onclick="signIn()">';
  content += '</form>';

  element.html(content);
}

/*
* Signs an account in.
* @returns  NA
*/
function signIn() {
  var account = getAccount( $("#username").val().toLowerCase() );

  try {
    localStorage.setItem("loggedInAccount", account.name);
  } catch (error) {
    console.error("Could not save " + account.name + ". " + error.name
      + ": " + error.message);
  }
}

/*
* Gets the current signed-in account's name.
* @return the current signed-in account, student if  none!
*/
function getSignedInAccount() {
  if (typeof (window.Storage) === "undefined"){
		// storage not supported by browser
    console.error("Storage is not supported by this browser");
  } else if (localStorage.getItem("loggedInAccount") == null){
	   // nothing stored at that key
     return "student";
  } else {
    // result successfully found
    return localStorage.getItem("loggedInAccount");
  }
}
