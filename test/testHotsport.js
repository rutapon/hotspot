var api = require('mikronode');

var device = new api('192.168.1.52');
device.connect().then(([login]) => login('admin', '123456789#a')).then(function (conn) {

    var chan = conn.openChannel();

    //chan.write('/ip/hotspot/user/add', { 'name': 'test2', 'password': '' });
    chan.write('/ip/address/print');

    //chan.data.subscribe(d => console.log('Address Inject Data: ', d));

    // chan.on('trap', function (data) {
    //     console.log('Error setting IP: ' + data);
    // });
    chan.on('done', function (data) {
        console.log('/ip/hotspot/user/add', data);
    });
    
    chan.close();
    conn.close();
});