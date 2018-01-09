if (typeof (Storage) !== "undefined") {
    // Code for localStorage/sessionStorage.

    if (sessionStorage.user && sessionStorage.type == 'admin') {
        app.userModel = new app.models.UserModel(JSON.parse(sessionStorage.userModelattributes));
    }
    else {
        window.location.href = '/administrator/'
    }
} else {
    alert('Sorry! No Web Storage support..');
}

$(function () {
    $('#dpmName').text(sessionStorage.dpm);

    $("button").button();
    //$('[type=checkbox]').checkboxradio();


    var createUserItemViewObj = new app.views.CreateUserView();

});