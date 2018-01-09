/// <reference path="../../lib/jquery/jquery-2.1.1.js" />
/*global Backbone, jQuery, _, ENTER_KEY */
var app = app || { models: {}, collections: {}, views: {} };

(function ($) {
    'use strict';

    $(function () {
        app.views.PettyCashFormView = Backbone.View.extend({

            // Instead of generating a new element, bind to the existing skeleton of
            // the App already present in the HTML.
            //el: '#showProductNav',

            // Delegated events for creating new items, and clearing completed ones.
            events: {
                'keyup #moneyAddAmount': 'moneyAddAmountChange',
                'keyup #chqueData': 'chqueDataChange',
            },

            initialize: function () {
                var self = this;
                self.model.on('updateInItem', self.render, self);
                self.model.on('change:BF',self.render, self)
                self.render();
            },

            // Re-rendering the App just means refreshing the statistics -- the rest
            // of the app doesn't change.
            render: function () {
                var self = this;
                var bf = self.model.get('BF');
                console.log('bf', bf);
                self.$el.find('#PettyCashBF').text('B/F: ' + self.model.get('BF'));
                self.$el.find('#PettyCashBalance').text('Balance: ' + self.model.get('balance'));
                var moneyAddAmount = self.model.get('moneyAddAmount');
                if (moneyAddAmount) {
                    self.$el.find('#moneyAddAmount').val(moneyAddAmount);
                } else {
                    self.$el.find('#moneyAddAmount').val('');
                }
                self.$el.find('#chqueData').val(self.model.get('chqueData'));
            },
            moneyAddAmountChange: function () {
                var self = this;
                var moneyAddAmount = Number(self.$el.find('#moneyAddAmount').val());
                self.model.set('moneyAddAmount', moneyAddAmount);

            },
            chqueDataChange:function () {
                var self = this;
                var chqueData = self.$el.find('#chqueData').val();
                self.model.set('chqueData', chqueData);
            }

        });
    });

})(jQuery);
