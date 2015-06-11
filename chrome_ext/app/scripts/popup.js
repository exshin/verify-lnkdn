
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


document.addEventListener('DOMContentLoaded', function() {
    build_popup();
    build_login();
    build_logout();
});
