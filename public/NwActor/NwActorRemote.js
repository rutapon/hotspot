/// <reference path="../../lib/socket.io-1.0.6.js" />
/// <reference path="../../Lib/step/step.js" />

/// <reference path="../../NwLib/NwLib.js" />
/// <reference path="../../NwUtil/NwDataMsgObj.js" />

/// <reference path="../NwConn/NwConn.js" />


(function (context, undefined) {
    //#region requre

    if (typeof module !== "undefined") {

        NwLib = require('../NwLib/NwLib.js');
        Class = NwLib.Nwjsface.Class;

        NwDataMsgObj = require('../NwUtil/NwDataMsgObj.js');

        //http = require('http');

        NwConn = require('../NwConn/NwConn.js');

        _ = require('../Lib/underscore/underscore.js');

    } else {

    }

    //#endregion
    var NwActorRemote = Class(function () {

        return {
            //$singleton: true,

            nwConn: {},
            remoteActor: {},
            socketDisc: [],

            isIdByIp: true,

            constructor: function () {

                var self = this;
                this.nwConn = new NwConn();

                this.nwConn.setOnConnectEventListener(function (socket) {
                    self.socketDisc = self.nwConn.getSocketDiscriptions();

                    if (self._onConnectEventListener) {
                        self._onConnectEventListener(socket);
                    }
                });
            },

            connectToActor: function (ip, cb) {
                this.nwConn.activeConn('ws://' + ip + ':426', cb);
            },

            getPidFromIp: function (ip) {

                if (this.socketDisc.length > 0) {
                    var obj = _.find(this.socketDisc, function (obj) {
                        return obj.ip == ip;
                    });

                    if (obj) {
                        return obj.sid;
                    }
                }

                return null;
            },

            writePin: function (id, pid, state, cb) {
                var sid = this.isIdByIp ? this.getPidFromIp(id) : id;

                this.nwConn.callService('writePin', { pid: pid, state: state }, function (data, type) {
                    if (cb) cb(data);
                }, sid);
            },

            readPin: function () {

            },

            getNumPin: function myfunction(id, pinType, cb) {
                var sid = this.isIdByIp ? this.getPidFromIp(id) : id;
                this.nwConn.callService('getNumPin', { pinType: pinType }, function (data, type) {
                    if (cb) cb(data);
                }, sid);
            },

            getPinsState: function (id, pinType, cb) {
                var sid = this.isIdByIp ? this.getPidFromIp(id) : id;
                this.nwConn.callService('getPinsState', { pinType: pinType }, function (data, type) {
                    if (cb) cb(data);
                }, sid);
            },

            getSensorIds: function (id, cb) {
                var sid = this.isIdByIp ? this.getPidFromIp(id) : id;
                this.nwConn.callService('getSensorIds', {}, function (data, type) {
                    if (cb) cb(data);
                }, sid);
            },

            getSensorValue: function (id, name, sensorId, cb) {
                var sid = this.isIdByIp ? this.getPidFromIp(id) : id;
                this.nwConn.callService('getSensorValue', { name: name, id: sensorId }, function (data, type) {
                    if (cb) cb(data);
                }, sid);
            },

            writeDtPin: function (id, nodeId, pinId, type, state, cb) {
                var sid = this.isIdByIp ? this.getPidFromIp(id) : id;

                this.nwConn.callService('writeDtPin', { nodeId: nodeId, pinId: pinId, type: type, state: state }, function (data, type) {
                    if (cb) cb(data);
                }, sid);
            },
            readDtPin: function (id, nodeId, pinId, type, cb) {
                var sid = this.isIdByIp ? this.getPidFromIp(id) : id;

                this.nwConn.callService('readDtPin', { nodeId: nodeId, pinId: pinId, type: type }, function (data, type) {
                    if (cb) cb(data);
                }, sid);
            },

            getPinsState: function (id, nodeId, type, cb) {
                var sid = this.isIdByIp ? this.getPidFromIp(id) : id;

                this.nwConn.callService('getPinsState', { nodeId: nodeId, type: type }, function (data, type) {
                    if (cb) cb(data);
                }, sid);
            },

            getDeviceName: function (id, nodeId, type, cb) {
                var sid = this.isIdByIp ? this.getPidFromIp(id) : id;

                this.nwConn.callService('getDeviceName', { nodeId: nodeId, type: type }, function (data, type) {
                    if (cb) cb(data);
                }, sid);
            },
            getDeviceModel: function (id, nodeId, type, cb) {
                var sid = this.isIdByIp ? this.getPidFromIp(id) : id;

                this.nwConn.callService('getDeviceModel', { nodeId: nodeId, type: type }, function (data, type) {
                    if (cb) cb(data);
                }, sid);
            },
            getNodeIds: function (id, type, cb) {
                var sid = this.isIdByIp ? this.getPidFromIp(id) : id;

                this.nwConn.callService('getNodeIds', { type: type }, function (data, type) {
                    if (cb) cb(data);
                }, sid);
            },
            getNodeInfo: function (id, type, cb) {
                var sid = this.isIdByIp ? this.getPidFromIp(id) : id;

                this.nwConn.callService('getNodeInfo', { type: type }, function (data, type) {
                    if (cb) cb(data);
                }, sid);
            },
            //#region regEvent
            setOnOutputStateChangeListener: function (id, cb) {
                var sid = this.isIdByIp ? this.getPidFromIp(id) : id;
                this.nwConn.regEvent('OnOutputStateChange', function (data, type) {
                    if (cb) cb(data);
                }, sid);
            },
            setOnInputStateChangeListener: function (id, cb) {
                var sid = this.isIdByIp ? this.getPidFromIp(id) : id;
                this.nwConn.regEvent('OnInputStateChange', function (data, type) {
                    if (cb) cb(data);
                }, sid);
            },
            setOnSensorValueChangeListener: function (id, cb) {
                var sid = this.isIdByIp ? this.getPidFromIp(id) : id;
                this.nwConn.regEvent('OnSensorValueChange', function (data, type) {
                    if (cb) cb(data);
                }, sid);
            },
            setOnActorNodeConnectListener: function (id, cb) {
                var sid = this.isIdByIp ? this.getPidFromIp(id) : id;
                this.nwConn.regEvent('setOnActorNodeConnect', function (data, type) {
                    if (cb) cb(data);
                }, sid);
            },
            setOnActorNodeDisconnectListener: function (id, cb) {
                var sid = this.isIdByIp ? this.getPidFromIp(id) : id;
                this.nwConn.regEvent('setOnActorNodeDisconnect', function (data, type) {
                    if (cb) cb(data);
                }, sid);
            },
            setOnActorNodeMessage: function (id, cb) {
                var sid = this.isIdByIp ? this.getPidFromIp(id) : id;
                this.nwConn.regEvent('setOnActorNodeMessage', function (data, type) {
                    if (cb) cb(data);
                }, sid);
            },

            //#endregion

            //#region eventListener
            _onConnectEventListener: null,
            setOnConnectEventListener: function (eventListener) {
                this._onConnectEventListener = eventListener;
            },

            _onDisconnectEventListener: null,
            setOnDisconnectEventListener: function (eventListener) {
                this._onDisconnectEventListener = eventListener;
            },
            _onMessageEventListener: null,
            setOnMessageEventListener: function (eventListener) {
                this._onMessageEventListener = eventListener;
            }
            //#endregion
        };
    });

    if (typeof module !== "undefined" && module.exports) {                       // NodeJS/CommonJS
        module.exports = NwActorRemote;
    } else {

        context.NwActorRemote = NwActorRemote;
    }

})(this);
