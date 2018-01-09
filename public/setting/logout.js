
var parentWin = null;
function setWindow(pw) {
    parentWin = pw;
}

$(function () {
    $('#Logout').click(function () {
        parentWin.logout();
        //parentWin.location.href = '/'
        window.close();
    });
    $('#Cancel').click(function () {
        window.close();
    });


})