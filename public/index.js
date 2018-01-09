/// <reference path="NwLib/NwLib.js" />
/// <reference path="lib/jquery/jquery-2.1.1.js" />

var app = app || { models: {}, collections: {}, views: {} };

$(function () {
    var host = window.location.hostname;
    var port = window.location.port
    var protocol = 'ws:';

    $('#idmenu').mnmenu({ responsiveMenuEnabled: false });
    if (window.location.protocol == 'https:') {
        protocol = 'wss:';
        var wsClient = app.wsClient = new NwWsClient(protocol + '//' + host + ":" + port, { secure: true });
    } else {
        var wsClient = app.wsClient = new NwWsClient(protocol + '//' + host + ":" + port);
    }

    var serviceMethod = app.serviceMethod = new NwServiceConn(wsClient);

    wsClient.setOnConnectEventListener(function (socket) {
        var id = wsClient.getId();
        console.log('onConnect ' + id);
    });

    wsClient.setOnDisconnectEventListener(function myfunction() {

    });

    var v = (new Date()).getTime();

    var loadMainFrameHref = function (href) {
        $('#mainFrame').attr('src', href + '?v=' + v)
    }

    $(document).on('click', "#idmenu li", function (ev) {
        ev.preventDefault();
        var thisEl = $(ev.target);
        //var href = thisEl.parents("a").attr('href');
        var href = thisEl.attr('data-href');
        href = href ? href : thisEl.parents("li").attr('data-href');

        console.log('cl', href);
        if (href) {
            console.log(href);
            if (href.indexOf('.html') != -1) {

                let herfSp = href.split('?');
                let hrefWithPara = herfSp[0] + '?v=' + v;
                if (herfSp[1]) {
                    hrefWithPara = hrefWithPara + '&' + herfSp[1];
                }
                $('#mainFrame').attr('src', hrefWithPara)
            }
            else if (href == '#update') {
                window.location = 'update.html?v=' + v;
            }
            else if (href == '#logging') {
                loadLogin();
            }
            else if (href == '#logout') {
                loadLogout();
            }
        }


        //friendA.removeClass('ui-state-persist');
        //thisEl.addClass('ui-state-persist');

        //alert($(ev.target).parents("[data-role='navbar']").find('a').length);
        return false;
    });

    // $.get("test/index.html", function (data) {
    //     //$( ".result" ).html( data );
    //     //alert( "Load was performed." );
    //     console.log(data);
    //     $('#mainFrame').contents().find("html").html(data);
    //     //document.getElementById('mainFrame').contentWindow.document.body.innerHTML =data;
    //     //$('#mainFrame').contents().find("html").html('<button>test</button>');
    //     //$('#mainFrame').attr('src', "Home.html" )
    // });

    $('#mainFrame').attr('src', "networkLocal.html");

});