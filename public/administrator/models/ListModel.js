/// <reference path="../../lib/underscore/underscore.js" />
/// <reference path="../../lib/jquery/jquery-2.1.1.js" />
/// <reference path="../../lib/backbone/backbone.js" />


var app = app || { models: {}, collections: {}, views: {} };

(function ($) {
    'use strict';

    // Person Model
    app.models.ListModel = Backbone.Model.extend({
        defaults: {
            name: '',
            listType: ''
        },
        //toggle: function () {
        //    this.save({ completed: !this.get('completed') });
        //}
        save: function (cb) {
            var self = this;
            console.log('save ' + self.attributes);

            app.serviceMethod.findList(self.attributes, function (result) {
                if (result) {
                    console.log('find', result);
                    if (cb) cb(false)
                }
                else {
                    app.serviceMethod.insertList(self.attributes, function () {
                        if (cb) cb(true)
                    });
                }
            });
        },
        destroy: function (cb) {
            //var self = this;
            //console.log('destroy ' + self.attributes);
            app.serviceMethod.deleteList(this.attributes, function (result) {
                if (cb) cb(result);
            });
        },
    });

})(jQuery);
