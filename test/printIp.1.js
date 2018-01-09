var MikroNode = require('mikronode-ng');

var connection = MikroNode.getConnection('192.168.1.52', 'admin', '123456789#a');
connection.connect(function (conn) {

    var chan = conn.openChannel();
    conn.closeOnDone = true;
    // chan.write('/ip/hotspot/user/print', function () {
    //     chan.closeOnDone = true;
    //     chan.on('done', function (data) {
    //         var parsed = MikroNode.parseItems(data);
    //         parsed.forEach(function (item) {
    //             console.log(item);
    //         });
    //     });
    //     chan.once('trap', function (trap, chan) {
    //         console.log('Command failed: ' + trap);
    //     });
    //     chan.once('error', function (err, chan) {
    //         console.log('Oops: ' + err);
    //     });
    // });
    showUser(chan)
});

function showUser(chan, cb) {
	chan.write('/ip/hotspot/user/print', function () {
		chan.closeOnDone = true;
		chan.on('done', function (data) {
			var parsed = MikroNode.parseItems(data);
			parsed.forEach(function (item) {
				console.log(item);
			});
		});
		chan.once('trap', function (trap, chan) {
			console.log('Command failed: ' + trap);
		});
		chan.once('error', function (err, chan) {
			console.log('Oops: ' + err);
		});
	});
}
function addUser(chan, name, pass, cb) {

	chan.write(['/ip/hotspot/user/add', '=name=' + name, '=password=' + pass], function (c) {
		c.on('trap', function (data) {
			console.log('Error setting IP: ' + data);
		});
		c.on('done', function (data) {
			console.log('IP Set.', data);
		});
	});
}