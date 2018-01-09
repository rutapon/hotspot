var MikroNode = require('mikronode');
// Create API instance to a host.
var device = new MikroNode('192.168.1.52');

// Debug level is "DEBUG"
// device.setDebug(MikroNode.DEBUG);

var removeId = [];
// Connect to the MikroTik device.
device.connect()
    .then(([login]) => login('admin', '123456789#a'))
    .then(function (conn) {

        console.log("Connected")
        // var channel=conn.openChannel('all_addresses');
        // channel.closeOnDone(true); // only use this channel for one command.
        var listener = conn.openChannel('address_changes');
        listener.closeOnDone(true); // only use this channel for one command.

        // channel.write('/ip/address/print');
        listener.write('/ip/address/print');
        // channel.write('/ip/firewall/filter/print');

        listener.data.filter(d => d.data[d.data.length - 1].field !== '.dead').subscribe(d => {
         
            console.log("Log:", JSON.stringify(d.data));
        });

        // in 5 seconds, stop listening for address changes.
        setTimeout(function () {
            console.log("Closing out listener");
            listener.write('/cancel'); /* cancel listen */
        }, 500000);
    }).catch(function (err) {
        console.log("Failed to connect. ", err);
    });
