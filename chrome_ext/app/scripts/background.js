
/*
    Handles requests to server to get passcode.
    Auto-populates passcode in text form field.
*/

var passcode_attempts = 0;

function print_passcode() {
    chrome.storage.local.get('passcode', function (data) {
        console.log(data.passcode);
        if (data.passcode.linkedin) {
            $('#verification-code').val(data.passcode.linkedin);
        } else {
            passcode_attempts += 1;
            setTimeout(function () {
                if (passcode_attempts <= 10) {
                    print_passcode();
                }
            }, 1000);
        }
    });
}

$(document).ready(function() {
    if (document.URL.indexOf('consumer-two-step') > -1 ) {
        print_passcode();
    }
});

