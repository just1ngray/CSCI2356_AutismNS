$("#email_to_dropdown").on("change", function () {
    var email = this.value;

    switch (email) {
        case "charli":
            $("#email_to").val("Charli@tbd.ca");
            break;
        case "chrystal":
            $("#email_to").val("Chrystal@tbd.ca");
            break;
        case "terry":
            $("#email_to").val("Terrence.Goldsmith@smu.ca");
            break;
    }
});

$("#email_cc_dropdown").on("change", function () {
    var email = this.value;

    switch (email) {
        case "charli":
            $("#email_cc").val("Charli@tbd.ca");
            break;
        case "chrystal":
            $("#email_cc").val("Chrystal@tbd.ca");
            break;
        case "terry":
            $("#email_cc").val("Terrence.Goldsmith@smu.ca");
            break;
    }
});