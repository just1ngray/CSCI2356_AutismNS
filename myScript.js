/*
   - This javascript file runs the website.
   - author: Justin Gray (A00426753)
*/

/*
    Sends an the contents of compose page's forms to the console in JSON format.
    Pre-conditions: Must be on the compose page.
    Returns:        N/A
*/
function send() {
    // retrieve all the values of the form boxes on the compose page
    var to = $("#email_to").val();
    var cc = $("#email_cc").val();
    var subject = $("#email_subject").val();
    var body = $("#email_body").val();

    // print all the values to the console in JSON format
    console.log("{\"to\":\"" + to + "\"}");
    console.log("{\"cc\":\"" + cc + "\"}");
    console.log("{\"sb\":\"" + subject + "\"}");
    console.log("{\"emailtext\":\"" + body + "\"}");
}

/*
    Changes the window location to the inboxitem viewer page.
    Pre-conditions: User clicked an inbox item.
    Returns:        N/A
*/
function inboxItem() {
    window.location = "inboxitem.html";
}

/*
    Changes the window location to the sentitem viewer page.
    Pre-conditions: User clicked a sent item.
    Returns:        N/A
*/
function sentItem() {
    window.location = "sentitem.html";
}

/*
    Redirects user to the compose page. Pressing back on the compose page will
    take you back to the page that called this function.
    Pre-conditions: N/A
    Returns:        N/A
*/
function compose() {
    sessionStorage.setItem("lastPage", window.location);
    window.location = "compose.html";
}

/*
    Takes you back from the last page you were at.
    Pre-conditions: For proper function, compose() function had to previously
        been run.
    Returns:        N/A
*/
function cancelCompose() {
    // if it's an old browser and doesn't have storage
    if (typeof (sessionStorage) === "undefined") {
        window.location = "sentitems.html";
        return;
    }

    // get the page to redirect to
    var lastPg = sessionStorage.getItem("lastPage");

    // if compose() wasn't called, then ther will be no session storage:
    // redirect to the proper page
    if (lastPg == null) {
        lastPg = "sentitems.html";
    }
    window.location = lastPg;
}
