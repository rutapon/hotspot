var arpjs = require('arpjs')
var _ = require('underscore')
arpjs.table(function (err, table) {
    console.log(table)
})

//const arpScanner = require('arpscan');


// arpScanner(onResult, { command: 'arp-scan', interface: 'eth0' });
// setInterval(function () {
//     arpScanner(onResult, { command: 'arp-scan', interface: 'eth0' });
// }, 5000)

function onResult(err, data) {
    if (err) throw err;

    var result = _.find(data, function (item) {
        return item.ip == '192.168.1.176'
    })


    var arp = require('node-arp');

    arp.getMAC('192.168.1.176', function (err, mac) {
        if (!err) {
            console.log(mac);
        }
    });
    //var ips = _.pluck(data, 'ip')
    console.log(data.length);
    console.log(result);
}
