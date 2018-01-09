
var nwMikronode = require('../NwMikronode.js');
var async = require("async");
var _ = require('underscore');

//nwMikronode.showInfo('/1/ip-scan');


//nwMikronode.showInfo('/ip/hotspot/user/print');
//nwMikronode.showInfo('/ip/arp/print');

var now = new Date();
nwMikronode.showServerInfo(function (result) {
    var resultArray = _.map(result, function (item, key) {
        return { 'mac-address': key, 'host-name': item['host-name'], 'address': item['address'] };
    })
    console.log(_.keys(result).length);
    console.log(new Date() - now);

})