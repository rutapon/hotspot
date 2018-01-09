NwSS.pad.NoPadding = { pad: function () { }, unpad: function () { } };
var key = NwSS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939");
var iv = NwSS.enc.Hex.parse("00000000000000000000000000000000");

window.getPassword = function (username) {

    var encrypted = NwSS.SS.ect(username, key, { iv: iv, padding: NwSS.pad.NoPadding })
    //

    //console.log(encrypted, encrypted.salt, encrypted.toString());

    encrypted = encrypted.toString();
    // console.log(key,encrypted);
    let intVal = '';

    for (var index = encrypted.length - 5; index < encrypted.length - 1; index++) {
        var char = encrypted.charCodeAt(index) //username[key];
        intVal += char;

        //console.log(char);
    }
    //var test = NwSS.SS.dct(encrypted,).toString(NwSS.enc.Utf8);
    //var decrypted = NwSS.SS.dct(encrypted, key, { iv: iv, padding: NwSS.pad.NoPadding });
    //console.log(username, intVal.substr(0, 6));
    return intVal.substr(0, 6);
}