var NwMikronode = require('./NwMikronode.js');

//NwMikronode.addUser('newww','123456');
//NwMikronode.removeUser('A')
NwMikronode.showActive(function (result) {
    console.log(result);
})
NwMikronode.showUser(function (result) {
    console.log(result);
})
