$(function () {
    $('#exit').click(function () {
        alert('close');
        window.parent.close();
        //var gui = window.require('nw.gui')
        //gui.quit()
    });
    $('#exitAndLogout').click(function () {
        window.parent.close();
        //var gui = window.require('nw.gui')
        //gui.quit()
    });
    $('#Cancel').click(function () {
        window.parent.location.href = '/'
    });

})