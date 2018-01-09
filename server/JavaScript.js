/// <reference path="../node_modules/backbone/node_modules/underscore/underscore.js" />
/// <reference path="../node_modules/backbone/backbone.js" />


//#region requre

if (typeof module !== "undefined") {
    Backbone = require('backbone');

} else {

}
//#endregion


var TestModel = new Backbone.Model.extend({

});

var testModel = new Backbone.Model();
var testModel2 = new Backbone.Model();

testModel2.on('eventTest:testModel', function ( ev) {
    console.log('eventTest', ev);
});

testModel.on('all', function (eventName, ev) {
    console.log('all', eventName, ev);
    testModel2.trigger(eventName + ':testModel', ev);
    testModel2.trigger(eventName, ev, 'testModel');
});


testModel.trigger('eventTest', new Date());
