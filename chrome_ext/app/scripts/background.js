
/*
    Handles requests to server to get passcode.
    Auto-populates passcode in text form field.
*/

function $get_passcode(callback, failback) {
    // makes a request to log in
    chrome.storage.local.get('gvoice', function (data) {
        console.log(data.gvoice);
        email = data.gvoice.email;
        password = data.gvoice.password;
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
                console.log(response);
                callback(response);
            }).fail(function(response2) {
                console.log(response2.responseText);
            });
        }
    });
}

$(document).ready(function() {
    console.log('Ready!');
    if (document.URL.indexOf('consumer-two-step') > -1) {
        console.log('Getting Passcode...');
        $get_passcode(function(passcode) {
            if (passcode.passcode) {
                console.log('Retrieved Passcode: ', passcode.passcode)
                console.log($('#verification_code'));
                $('#verification_code').val(passcode.passcode);
            }
        });
    }
});
