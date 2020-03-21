/*
* This file contain functions that create dropdown menus for compose.html
*
* @author Justin Gray
* @author Vitor Jeronimo
* @author Jay Patel
*/

/* Detects a change in any dropdown menu that has the class "email_dropdown" and updates the correct input field with the chosen email address
 *@returns N/A
 */
$(".email_dropdown").on("change", function () {
    // Get the id of the dropdown menu and remove the "_dropdown" part of it in order to obtain the corresponding input id
    var field = $(this).attr("id").replace("_dropdown", "");

    // Get selected email address
    var email = this.value;

    // Set the correct email address into the corresponding input field
    switch (email) {
        case "charli":
            $(`#${field}`).val("Charli@tbd.ca");
            break;
        case "chrystal":
            $(`#${field}`).val("Chrystal@tbd.ca");
            break;
        case "terry":
            $(`#${field}`).val("Terrence.Goldsmith@smu.ca");
            break;
        case "student":
            $(`#${field}`).val("student@example.ca");
            break;
        default:
            $(`#${field}`).val("");
            break;
    }
});