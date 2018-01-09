
var parentWin = null;
function setWindow(pw) {
    parentWin = pw;
}

$(function () {
    $('#user').focus();
    var Login = function () {
        var user = $('#user').val();
        var pass = $('#pass').val();
        var dpm = $('#dpm').val();

        parentWin.login(user, pass, dpm, function (result) {
            if (result) {
                //parentWin.location.href = '/'
                window.close();
            } else {

                $('#errorShow').show();
            }
        });
        //var result = parentWin.login('admin', '123',dpm);

    }
    $('#Login').click(function () {
        Login();
    });

    $(document).keydown(function (e) {

        if (e.ctrlKey) {
            return;
        }

        //if (!(e.keyCode == 37 || e.keyCode == 39)) {
        if (e.keyCode == 13) {
            Login();
        }
        //$('#search').focus();
        //}
    });


    $('#Cancel').click(function () {
        window.close();
    });
})