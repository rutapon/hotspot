var app = app || { models: {}, collections: {}, views: {} };
var host = window.location.hostname;
var port = window.location.port;
var protocol = 'ws:';
//var host = 'localhost';
//var port = '8088';

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
