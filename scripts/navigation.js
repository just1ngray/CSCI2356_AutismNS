/*
* This file manages navigation in our email system.
*
* @author Jay Patel
* @author Justin Gray
* @author Vitor Jeronimo
*/

/*
* Navigates the user to a specific page.
* @param href the page to navigate to
* @returns    NA
*/
function goTo(href) {
  // save current page to localstorage if it's sentitems.html or index.html
  if (window.location.href.includes("sentitems.html")
    || window.location.href.includes("index.html")) {
    try {
      // write current page into localStorage for going back functionality
      localStorage.setItem("lastPage", window.location.href);
    } catch (error) {
      console.log("Could not save lastPage");
    }
  }

  // go to the new href
  window.location.href = href;
}

/*
* Takes the user back one page.
* @param doRefresh        if the page needs to be refreshed (default is true)
* @param composeOverride  if the page should include pop-up messages of
*                         current navigation status
* @returns                NA
*/
function goBack(doRefresh, composeOverride) {
  // if they are composing an email and press back (or cancel), confirm action
  if (window.location.href.includes("compose.html") && !composeOverride
    && !confirm("Are you sure you want to cancel? \n"
      + "Press OK to cancel composing this email.")) {
    return;
  }

  // go back without refreshing
  if (doRefresh != null && !doRefresh) {
    window.history.go(-1);
    return;
  }

  // goBack and refresh
  if (typeof (window.Storage) === "undefined") {
    // storage not supported by browser
    window.history.go(-1).reload();
  } else {
    // storage supported
    var lastPage = getLastPage();

    if (lastPage == null) {
      // no lastPage found, just go back
      window.history.go(-1).reload();
    } else {
      // lastPage found, go there
      window.location.href = lastPage;
    }
  }
}

/*
* @returns the last valid page the user was at (inbox and sent items only)
*/
function getLastPage() {
  if (typeof (window.Storage) === "undefined") {
    // storage not supported by browser
    return null;
  } else {
    // valid page found or return null if no page found
    return localStorage.getItem("lastPage");
  }
}

/*
* Opens a help window for a label at an id.
* @param id the element that stores the label for the help window
* @returns  NA
*/
function openHelp(id) {
  // the text inside the label of the id
  var label = document.getElementById(id).innerHTML;

  // depending on the valid of label, open a different window
  switch (label) {
    case "To":
      window.open("../help/helpto.html", "_blank",
        "width=500, height=200, left=300, top=250");
      break;
    case "From":
      window.open("../help/helpfrom.html", "_blank",
        "width=500, height=200, left=300, top=250");
      break;
    case "Cc":
      window.open("../help/helpcc.html", "_blank",
        "width=500, height=200, left=300, top=250");
      break;
    case "Subject":
      window.open("../help/helpsubject.html", "_blank",
        "width=500, height=200, left=300, top=250");
      break;
    case "Body":
      window.open("../help/helpbody.html", "_blank",
        "width=500, height=200, left=300, top=250");
      break;
    default:
      console.error("Help window not found for " + label + " at id:" + id);
  }
}

/*
* Confirms before deleting and canceling an email
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

/*
 * On clicking Help button, this displays the purpose of an immediate page
 * @param id  the type of page the help is for:
 *            Inbox, Compose, SentItems, ViewSent
 * @returns   NA
 */
function masterHelp(id) {

  //depending on the id, display appropriate dialog box
  switch (id) {

    case "Inbox":
      alert("The purpose of this page is to display all the emails you have recieved.");
      break;

    case "Compose":
      alert("The purpose of this page is to compose a new email.");
      break;

    case "SentItems":
      alert("The purpose of this page is to display all the emails sent.");
      break;

    case "ViewSent":
      alert("The purpose of this page is to view an email sent.");
      break;
  }
}
