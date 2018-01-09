
var static = require('node-static');
var codein = require("node-codein");
//
// Create a node-static server instance to serve the './public' folder
//
var file = new static.Server('../web');

require('http').createServer(function (request, response) {
    //console.log('connect');
    request.addListener('end', function () {
        //
        // Serve files!
        //
        file.serve(request, response);
    }).resume();
}).listen(80);


require('http').createServer(function (request, response) {
    //console.log('connect');
    request.addListener('end', function () {
        //
        // Serve files!
        //
        file.serve(request, response);
    }).resume();
}).listen(8088);

