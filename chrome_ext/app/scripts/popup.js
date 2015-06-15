
/*
  Dynamically compose the html for the popup.
  Handles login and options.
*/

var email, password;

function build_popup() {
    // build popup
    email = localStorage.getItem('gvoice_email');
    password = localStorage.getItem('gvoice_password');
    if (email && password && email != '' && password != '') {
        $('#login-form').hide();
        $('#user-logout-button').text('Log out: '+email);
        $('#user-display').show();
    }
}

function build_login() {
    // build login module if not logged in
    $('#login_button').on('click', function(data) {
        login();
    });
}

function build_logout() {
    // build logout button
    $('#user-logout-button').on('click', function() {
        localStorage.clear();
        $('#login-form').show();
        $('#user-display').hide();
    });
}

function login() {
    // login
    email = $('#email_input').val();
    password = $('#password_input').val();
    if (email && password && email != '' && password != '') {
        console.log(email,password);
        localStorage.setItem('gvoice_email', email);
        localStorage.setItem('gvoice_password', password);
        chrome.storage.local.set({
            gvoice: {
                email: email,
                password: password,
                authenticated: true
            }
        },  function() {
            console.log('Logged In');
            $('#login-form').hide();
            $('user-logout-button').text('Log out: '+email);
            $('#user-display').show();
        });
    }
}

function $get_passcode(callback, failback) {
    // makes a request to log in
    chrome.storage.local.get('gvoice', function (data) {
        console.log(data.gvoice);
        email = data.gvoice.email;
        password = data.gvoice.password;
        if(email && password && email != '' && password != '') {
            var req = {
                type: 'POST',
                url: 'http://verify-lnkdn.herokuapp.com/passcode/',
                //url: 'http://localhost/passcode/',
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

function show_passcode() {
    if (document.URL.indexOf('consumer-two-step') > -1 || document.URL) {
        $('#passcode-wait').show();
        console.log('Getting Passcode...');
        $get_passcode(function(passcode) {
            if (passcode.passcode) {
                console.log('Retrieved Passcode: ', passcode.passcode);
                $('#passcode-display').html('<br/><div id="passcode_text">Last Passcode: '+passcode.passcode+'</div>');
                $('#passcode-wait').hide();
                $('#passcode-display').show();
                chrome.storage.local.set({
                    passcode: {
                        linkedin: passcode
                    }
                },  function() {
                    console.log('Stored Passcode');
                });
            } else {
                $('#passcode-error').show();
            }
        });
    }
}



document.addEventListener('DOMContentLoaded', function() {
    build_popup();
    build_login();
    build_logout();
    show_passcode();
});
