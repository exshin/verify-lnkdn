
/*
    Handles requests to server to get passcode.
    Auto-populates passcode in text form field.
*/

function $get_passcode(callback, failback) {
    // makes a request to log in
    chrome.runtime.sendMessage({method: "getEmail"}, function(response) {
        email = response.status;
        chrome.runtime.sendMessage({method: "getPassword"}, function(response) {
            password = response.status;
            if(email && password && email != '' && password != '') {
                var req = {
                    type: 'POST',
                    url: 'https://verify-lnkdn.herokuapp.com/passcode/',
                    data: {
                        'email': email,
                        'password': password
                    }
                };
                $.ajax(req).done(function(response) {
                    callback(response);
                }).fail(function(response2) {
                    console.log(response2.responseText);
                });
            }
        });
    });
}

$(document).ready(function() {
    if (document.URL.indexOf('consumer-two-step') > -1) {
        console.log('Getting Passcode...')
        $get_passcode(function(passcode) {
            if (passcode) {
                console.log('Retrieved Passcode: ', passcode)
                $('#verification_code').val(passcode);
            }
        });
    }
});





