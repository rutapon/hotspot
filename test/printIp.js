var api = require('mikronode');

 var connection = new api('192.168.1.52','admin','123456789#a');
 connection.connect(function(conn) {

    var chan=conn.openChannel();

    chan.write('/ip/address/print',function() {
       chan.on('done',function(data) {

          var parsed = api.parseItems(data);

          parsed.forEach(function(item) {
             console.log('Interface/IP: '+item.interface+"/"+item.address);
          });

          chan.close();
          conn.close();

       });
    });
 });
