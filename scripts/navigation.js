/*
* This file manages navigation in our email system.
*
* @author Justin Gray
* @author Vitor Jeronimo
* @author Jay Patel
*/

/*
* Navigates the user to a specific page.
* @param href the page to navigate to
* @returns    NA
*/
function goTo(href) {
  // write current page into localStorage for going back functionality

  // if no page history is found, OR
  // the page found is the page we are not going to
  if (getLastPage() == null || getLastPage() != href) {
    try {
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
* @param    if the page needs to be refreshed (default is true)
* @returns  NA
*/
function goBack(doRefresh) {
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
