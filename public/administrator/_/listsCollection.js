/// <reference path="../../lib/underscore/underscore.js" />
/// <reference path="../../lib/jquery/jquery-2.1.1.js" />
/// <reference path="../../lib/backbone/backbone.js" />
/// <reference path="../../lib/lokijs/lokijs.js" />

var app = app || { models: {}, collections: {}, views: {} };

(function ($) {
    'use strict';

    // Person Model
    app.collections.listsCollection = Backbone.Collection.extend({
        model: app.models.listModel,

        initialize: function () {

        },

        getAll: function (stockSelected, cb, supplierSelected) {
            console.log('getAll');
            var self = this;

            self.reset([{
                name: 'main',
                type: 'store'
            }, {
                name: 'main',
                type: 'OE'
            }, ]);
        },

    });

})(jQuery);
