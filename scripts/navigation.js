/*
* This file manages navigation in our email system.
*
* @author Justin Gray (A00426753)
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
  try {
    localStorage.setItem("lastPage", window.location.href);
  } catch (error) {
    console.log("Could not save lastPage");
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
  } else if (localStorage.getItem("lastPage") != null) {
    // valid page found
    window.location.href = localStorage.getItem("lastPage");
  } else {
    // use in-browser history
    window.history.go(-1).reload();
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
