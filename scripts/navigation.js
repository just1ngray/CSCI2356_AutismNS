// Description: This file contains functions that link the header fields on compose.html to help pages.
// Author: Vitor Jeronimo (A00431599)

/*
* Navigates the user to a specific page.
* @param href the page to navigate to
* @returns    NA
*/
function goTo(href) {
  try {
    localStorage.setItem("lastPage", window.location.href);
  } catch (error) {
    console.log("Could not save lastPage");
  }

  window.location.href = href;
}

/*
* Takes the user back one page. Refreshes the page if possible.
* @returns  NA
*/
function goBack() {
  if (typeof (window.Storage) === "undefined"){
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
  //var label = $("#" + id).val();
  var label = document.getElementById(id).innerHTML;

  // depending on the valid of label, open a different window
  switch (label) {
    case "To":
      window.open("./help/helpto.html", "_blank", "width=500, height=200, left=300, top=250");
      break;
    case "From":
      break;
    case "Cc":
      window.open("./help/helpcc.html", "_blank", "width=500, height=200, left=300, top=250");
      break;
    case "Subject":
      window.open("./help/helpsubject.html", "_blank", "width=500, height=200, left=300, top=250");
      break;
    case "Body":
      window.open("./help/helpbody.html", "_blank", "width=500, height=200, left=300, top=250");
      break;
    default:
      console.error("Help window not found for " + label + " at id:" + id);
  }
}
