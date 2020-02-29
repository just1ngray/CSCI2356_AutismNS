// Description: This file contains functions that link the header fields on compose.html to help pages.
// Author: Vitor Jeronimo (A00431599)

// Opens a help page with info about the header field "To"
// Returns: N/A
$("#email_to_label").on("click", function() {
    window.open("./help/helpto.html", "_blank", "width=500, height=200, left=300, top=250");
});

// Opens a help page with info about the header field "Cc"
// Returns: N/A
$("#email_cc_label").on("click", function() {
    window.open("./help/helpcc.html", "_blank", "width=500, height=200, left=300, top=250");
});

// Opens a help page with info about the header field "Subject"
// Returns: N/A
$("#email_subject_label").on("click", function() {
    window.open("./help/helpsubject.html", "_blank", "width=500, height=200, left=300, top=250");
});

// Opens a help page with info about the header field "Body"
// Returns: N/A
$("#email_body_label").on("click", function() {
    window.open("./help/helpbody.html", "_blank", "width=500, height=200, left=300, top=250");
});