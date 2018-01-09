/// <reference path="../lib/jquery/jquery-2.1.1.js" />
/// <reference path="../lib/underscore/underscore.js" />
/// <reference path="../lib/backbone/backbone.js" />

/// <reference path="../NwLib/NwLib.js" />
/// <reference path="../NwConn/NwConn.js" />
/// <reference path="../service_conn/NwServiceConn.js" />
/// <reference path="models/Stock.js" />
var app = app || { models: {}, collections: {}, views: {} };

(function () {

    var host = window.location.hostname;
    //var host = 'andamania.duckdns.org';

    var port = window.location.port
    var protocol = 'ws:';
    //var host = 'localhost';
    //var host = 'newww.dyndns.org';
    //alert(window.location.protocol + window.location.port);

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


    app.time = {
        addHours: function (date, hours) {
            var result = new Date(date);
            result.setHours(result.getHours() + hours);
            return result;
        },
        addDays: function (date, days) {
            var result = new Date(date);
            result.setDate(result.getDate() + days);
            return result;
        },
        addMonths: function (date, months) {
            var result = new Date(date);
            result.setMonth(result.getMonth() + months);
            return result;
        },
        addYears: function (date, years) {
            var result = new Date(date);
            result.setFullYear(result.getFullYear() + years);
            return result;
        },
        removeTimezoneOffset: function (now) {
            return this.addHours(now, -now.getTimezoneOffset() / 60);
        },
        addTimezoneOffset: function (now) {
            return this.addHours(now, now.getTimezoneOffset() / 60);
        }
    };
    app.math = {
        subtraction: function (a, b, fix) {
            if (!fix) fix = 10000000;
            return (a * fix - b * fix) / fix;
            // Math.floor((-0.2-0.1)*SIGDIG)/SIGDIG 
        },
        addition: function (a, b, fix) {
            if (!fix) fix = 10000000;
            return (a * fix + b * fix) / fix;
        },
        add: function (a, b, precision) {
            var x = Math.pow(10, precision || 2);
            return (Math.round(a * x) + Math.round(b * x)) / x;
        },
        precision: function (a, precision) {
            var x = Math.pow(10, precision || 2);
            return (Math.round(a * x)) / x;
        }
    };
    app.url = {
        getUrlParameter: function (sParam) {
            var sPageURL = decodeURIComponent(window.location.search.substring(1)),
                sURLVariables = sPageURL.split('&'),
                sParameterName,
                i;

            for (i = 0; i < sURLVariables.length; i++) {
                sParameterName = sURLVariables[i].split('=');

                if (sParameterName[0] === sParam) {
                    return sParameterName[1] === undefined ? true : sParameterName[1];
                }
            }
        }
    }


    $(function () {

 
    });
})();
