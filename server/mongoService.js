const exec = require('child_process').exec;

const fs = require("fs"); //Load the filesystem module
const stats = fs.statSync("/var/lib/mongodb/mongod.lock")
const fileSizeInBytes = stats.size


var runCmd = function (cmd, cb) {
    exec(cmd, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        if (cb) cb();
    });
}

console.log('mongod.lock', fileSizeInBytes);
if (fileSizeInBytes) {
    console.log('start repair');
    runCmd('/usr/bin/mongod --quiet --dbpath /var/lib/mongodb --repair', function () {
        console.log('start mongod');
        runCmd('/usr/bin/mongod --quiet --config /etc/mongodb.conf');
    });
} else {
    console.log('start mongod');
    exec('/usr/bin/mongod --quiet --config /etc/mongodb.conf');
}
