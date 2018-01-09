/// <reference path="../../lib/underscore/underscore.js" />
/// <reference path="../../lib/jquery/jquery-2.1.1.js" />
/// <reference path="../../lib/backbone/backbone.js" />


var app = app || { models: {}, collections: {}, views: {} };

(function ($) {
    'use strict';

    // Person Model
    app.collections.ListsCollection = Backbone.Collection.extend({
        model: app.models.ListModel,
        getAll: function (cb) {
            var self = this;
            app.serviceMethod.getAllList({}, function (result) {
                console.log(JSON.stringify(result));
                
                self.reset(result);

                if (cb) cb(result);
            });
        }
    });

})(jQuery);
