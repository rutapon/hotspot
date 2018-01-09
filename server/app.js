/// <reference path="../lib/NwLib.js" />
/// <reference path="../lib/underscore/underscore.js" />
/// <reference path="NwServiceProcess.js" />
/// <reference path="service_method/NwStockServiceMethod.js" />
/// <reference path="NwConn/NwWsServer.js" />

(function (context, undefined) {
    //#region requre

    if (typeof module !== "undefined") {
        process.chdir(__dirname);

        _ = require('../lib/underscore/underscore.js');
        async = require("async");

        NwLib = require('../lib/NwLib.js');
        Class = NwLib.Nwjsface.Class;

        NwServiceProcess = require('./NwServiceProcess.js');
        NwStockServiceMethod = require('./service_method/NwStockServiceMethod.js');

        http = require('http');
        NwWsServer = require('./NwConn/NwWsServer.js');

        //require('./StaticHttp.js');

        //request = require('request');

        var express = require('express');
        var compression = require('compression');
        //var minify = require('express-minify');

        // var nodestatic = require('node-static');
        // file = new nodestatic.Server(__dirname + '/../public');

        var app = express();

        app.use(compression());

        app.use(function (req, res, next) {
            if (/\.min\.(css|js)$/.test(req.url)) {
                res._no_minify = true;
            }
            next();
        });

        //app.use(minify()); 

        // app.use(function (req, res) {
        //     file.serve(req, res);
        // });

        var staticPath = __dirname + '/../public';
        console.log(staticPath);
        app.use('/', express.static(staticPath))

        //require('mkdirp')(__dirname + '/../cache', function (err) {
        //    if (err) console.error(err)
        //    else app.use(minify({
        //        cache: __dirname + '/../cache'
        //    }));    
        //});

    } else {

    }


    var passiveConn = function (appServer, port, ip) {
        var self = this;

        var wsServer = new NwWsServer(appServer);
        
        NwStockServiceMethod.addNwWsServer(wsServer);
        NwServiceProcess.addServiceMethod(NwStockServiceMethod);
        

        //var key;
        //if (port) {
        //    if (!ip) {
        //        ip = '0.0.0.0'
        //    }

        //    key = ip + ':' + port;

        //} else {
        //    key = Nw.getGUID();
        //}

        //this.wsServerList.addItem(key, wsServer);

        wsServer.setOnConnectEventListener(function (socket) {
            console.log('setOnConnectEventListener ' + socket.id);
            //if (self._onConnectEventListener) {
            //    self._onConnectEventListener(new NwSocket(socket, 'passive'));
            //}
        });

        wsServer.setOnDisconnectEventListener(function (socket) {
            console.log('setOnDisconnectEventListener');
            //var disconnectId = socket.id;
            //console.log('disconnect ' + socket.id);

            //self.wsClientList.removeItem(disconnectId);

            //if (self._onDisconnectEventListener) {
            //    self._onDisconnectEventListener(new NwSocket(socket, 'passive'));
            //}
        });

        wsServer.setOnMessageEventListener(function (socket, msgObj, fn) {
            //console.log('setOnMessageEventListener ' + JSON.stringify( msgObj));
            //if (self._onMessageEventListener) {
            //    try {
            //        self._onMessageEventListener(new NwSocket(socket, 'passive'), msgObj, fn);
            //    } catch (e) {
            //        //throw e;
            //        console.log('err wsServer.setOnMessageEventListener :' + e);
            //    }
            //}

            NwServiceProcess.cammandProcess(msgObj, function (result) {
                //console.log(result);
                fn(result);
            });
        });
    }

    var listenCommand = function (commandPort) {
        this.commandPort = commandPort;

        var appServer = http.createServer(app);
        passiveConn(appServer);

        //appServer.listen(commandPort, '0.0.0.0');
        appServer.listen(commandPort);

    }

    listenCommand(process.env.PORT || 8089);

    var runCmd = function (cmd) {
        const exec = require('child_process').exec;
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
        });
    }

    var updateSntp = () => {
        runCmd('sntp -s time.google.com');
    }
    updateSntp();

    setInterval(function () {
        updateSntp();
    }, 60 * 60000)

    //require('../updateDNS.js');

    //NwStockServiceMethod.getAllProducts();
})(this);

