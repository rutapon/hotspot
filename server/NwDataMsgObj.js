/// <reference path="../NwLib/NwLib.js" />

(function (context, undefined) {
    //#region requre
  
    if (typeof module !== "undefined") {
        NwLib = require('../NwLib/NwLib.js');
        Class = NwLib.Nwjsface.Class;
        NwJsonSerializable = NwLib.NwJsonSerializable;
    } else {

    }
    //#endregion
    var NwDataMsgObj = Class(NwJsonSerializable, function () {

        return {

            ///#region message packet
            //use only these for now

            //np: [],//nodePath
            //cni: 0,//currnetNodeIndex

            msg: '', // message name
            cat: '', // category of mesage  "cmd"
            type: '',// type of data ex "paraObj" or "resultObj"

            data: {},

            //ts: new Date(),//time send/create

            //key: '',//_authenKey;

            ///#endregion 
            constructor: function () {
                NwDataMsgObj.$super[0].call(this);
            }
        };
    });

    if (typeof module !== "undefined" && module.exports) {                       // NodeJS/CommonJS
        module.exports = NwDataMsgObj;
    } else {

        context.NwDataMsgObj = NwDataMsgObj;
    }

})(this);
