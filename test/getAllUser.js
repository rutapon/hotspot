var MikroNode = require('mikronode');
// Create API instance to a host.
var device = new MikroNode('192.168.1.52');


var removeId = [];
// Connect to the MikroTik device.
device.connect().then(([login]) => login('admin', '123456789#a')).then(function (conn) {



    var channel = conn.openChannel();
    channel.closeOnDone(true); // only use this channel for one command.


    channel.write('/ip/address/print');

    channel.done //merge done with data from firewall connections. why? no reason.
        .scan(function (last, stream, idx) {
            // console.log('Concat stream data to last',JSON.stringify(stream,true,2));
            if (stream.type === 'done') {
                console.log('Concat stream data to last', stream.type);
                return last.concat(stream.data.map(MikroNode.resultsToObj));
            }
            else {
                const data = MikroNode.resultsToObj(stream.data);
                if (data['.dead']) {
                    return last.filter(function (n) {
                        return n.field == '.id' !== data['.id'];
                    });
                } else {
                    console.log("New  detected", data);
                    removeId.push(data['.id']);
                    return last.concat(data);
                }
            }
        }, []).subscribe(function (changes) {
            ipList = changes;
        });


}, function (err) {
    console.log("Failed to connect. ", err);
});