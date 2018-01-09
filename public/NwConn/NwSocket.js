/// <reference path="../../lib/socket.io-1.0.6.js" />
/// <reference path="../../Lib/step/step.js" />

/// <reference path="../../NwLib/NwLib.js" />
/// <reference path="../../NwUtil/NwDataMsgObj.js" />

(function (context, undefined) {
    //#region requre

    if (typeof module !== "undefined") {
        io = require('socket.io-client');
        NwLib = require('../NwLib/NwLib.js');
        Class = NwLib.Nwjsface.Class;

        NwDataMsgObj = require('../NwUtil/NwDataMsgObj.js');

    } else {

    }

    //#endregion
    var NwSocket = Class(function () {

        return {
            //$singleton: true,
            socket: {},
            type: '',
            _forceId: '',
            constructor: function (socket, type, forceId) {

                this.socket = socket;
                this.type = type;
                this._forceId = forceId;
            },

            getId: function () {

                if (this._forceId) {
                    return this._forceId;
                }
                else if (this.type == 'active') {
                    return this.socket.io.engine.id;
                }
                else {
                    return this.socket.id;
                }
            },

            getUri: function () {

                if (this.type == 'active') {
                    return this.socket.io.uri;
                } else {
                    return this.socket.socket.handshake.url
                }
            },

            getIp: function () {

                if (this.type == 'active') {
                    return this.getUri().split('/')[2].split(':')[0];
                } else {

                    return this.socket.handshake.address;
                }
            },

        };
    });

    if (typeof module !== "undefined" && module.exports) {                       // NodeJS/CommonJS
        module.exports = NwSocket;
    } else {

        context.NwSocket = NwSocket;
    }

})(this);
