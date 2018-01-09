var nwMikronode = require('../NwMikronode.js');
var async = require("async");
var _ = require('underscore');

//nwMikronode.showInfo('/1/ip-scan');


//nwMikronode.showInfo('/ip/hotspot/user/print');
//nwMikronode.showInfo('/ip/arp/print');

async.series([function (callback) {
    nwMikronode.showInfo('/ip/dhcp-server/lease/print', {}, function (result) {

        //console.log(result[0]);
        var pickData = ['.id', 'address', 'mac-address',
            'expires-after', 'last-seen', 'host-name']
        result = _.map(result, function (item) {
            return _.pick(item, pickData);
        });

        console.log('dhcp-server/lease', result.length, JSON.stringify(result).length);
        callback();
    });
},
function (callback) {
    nwMikronode.showInfo('/ip/arp/print', {}, function (result) {
        //console.log(result[0]);
        var pickData = ['.id', 'address', 'mac-address']
        result = _.map(result, function (item) {
            return _.pick(item, pickData);
        });
        console.log('arp', result.length,JSON.stringify(result).length);
        callback();
    });

},
function (callback) {
    nwMikronode.showInfo('/ip/firewall/connection/print', {}, function (result) {

        console.log('connection',result.length);
        var pickData = ['.id', 'src-address', 'dst-address',
            'orig-bytes', 'orig-rate',
            'repl-bytes', 'repl-rate']
        result = _.map(result, function (item) {
            return _.pick(item, pickData);
        });

        console.log('connection', result[0], JSON.stringify(result).length);
        callback();
    });
}], function (params) {

})


