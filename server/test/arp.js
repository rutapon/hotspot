var arp = require('node-arp');


arp.getMAC('192.168.1.199', function(err, mac) {
    if (!err) {
        console.log(mac);
    }
});