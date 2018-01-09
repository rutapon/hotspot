Step(function getScript1() {
    if (!this.NwLib) $.getScript('../lib/NwLib/NwLib.js', this);

}, function getScript2() {

    if (!this.NwDataMsgObj) $.getScript('../lib/NwUtil/NwDataMsgObj.js', this.parallel());

}, function run() {

    var obj = new NwDataMsgObj();
    console.log(JSON.stringify(obj));
});