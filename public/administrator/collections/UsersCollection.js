/// <reference path="../../lib/underscore/underscore.js" />
/// <reference path="../../lib/jquery/jquery-2.1.1.js" />
/// <reference path="../../lib/backbone/backbone.js" />
/// <reference path="../../lib/lokijs/lokijs.js" />

var app = app || { models: {}, collections: {}, views: {} };

(function ($) {
    'use strict';

    // Person Model
    app.collections.UsersCollection = Backbone.Collection.extend({
        model: app.models.UserModel,

        initialize: function () {


        },
        getAll: function (cb) {

            var self = this;
            app.serviceMethod.getAllUser({}, function (result) {
                console.log('getAll user', result);
                self.reset(result);

                if (cb) cb(result);
            });
        }
    });

})(jQuery);
