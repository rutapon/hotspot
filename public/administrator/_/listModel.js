/// <reference path="../../lib/underscore/underscore.js" />
/// <reference path="../../lib/jquery/jquery-2.1.1.js" />
/// <reference path="../../lib/backbone/backbone.js" />


var app = app || { models: {}, collections: {}, views: {} };

(function ($) {
    'use strict';

    // Person Model
    app.models.listModel = Backbone.Model.extend({
        defaults: {
            name: null,
            type: null
        },

        //initialize: function () {
        //    console.log(this.attributes);             
        //},

        validate: function (attrs, options) {
            return attrs.name && attrs.type;
        },
        save: function (stockName, cb) {
            var self = this;
        },

        update: function (cb) {
            var self = this;
        },
     
        destroy: function (cb) {

        },

        isEmty: function () {
            var attrs = this.attributes;
            return !(attrs.name || attrs.type);
        }

        //,
        //removeUi: function () {
        //    alert('trigger remove');

        //    this.trigger('removeUi', this);
        //}
    });

})(jQuery);
