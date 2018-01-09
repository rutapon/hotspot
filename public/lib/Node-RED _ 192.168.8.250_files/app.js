/// <reference path="../lib/jquery/jquery-2.1.1.js" />
/// <reference path="../lib/underscore/underscore.js" />
/// <reference path="../lib/backbone/backbone.js" />
/// <reference path="../NwLib/NwLib.js" />
/// <reference path="../NwConn/NwConn.js" />
/// <reference path="../service_conn/NwServiceConn.js" />


(function (context, undefined) {

    //#region requre

    if (typeof module !== "undefined") {

        NwWsClient = require('../NwConn/NwWsClient.js');
        NwServiceConn = require('../service_conn/NwServiceConn.js');
        NwTimeScheduleServiceConn = require('../service_conn/NwTimeScheduleServiceConn.js');

        var host = 'localhost';
    } else {
         var host = window.location.hostname;
    }

    //#endregion
   
    //var host = 'newww.dyndns.org';
    if (!this.app) this.app = {};
    var wsClient = app.wsClient = new NwWsClient('ws://' + host + ':426');
    app.serviceMethod = new NwServiceConn(wsClient);
    app.timeScheduleServiceMethod = new NwTimeScheduleServiceConn(wsClient);

    if (typeof module !== "undefined" && module.exports) {                       // NodeJS/CommonJS
        module.exports = app;
    } else {

        context.app = app;
    }

})(this);
