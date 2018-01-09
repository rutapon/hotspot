/// <reference path="../../lib/jquery/jquery-2.1.1.js" />
/*global Backbone, jQuery, _, ENTER_KEY */
var app = app || { models: {}, collections: {}, views: {} };

(function ($) {
    'use strict';

    $(function () {
        app.views.EditProductTableTr = Backbone.View.extend({

            tagName: 'div',
            className: 'listItem',

            //isEditing: false,
            //isEdited: false,

            events: {
                
               'click .renameButton': 'editClick',
               'click .removeButton': 'removeClick',
            },

            initialize: function () {
                //this.model.on('change', this.render, this);
                this.model.on('destroy', this.remove, this);
                //this.model.on('removeUi', this.remove, this);
                this.model.on('remove', this.remove, this);
                //this.collection.on('reset', this.render, this);

                this.model.on('edit', this.edit, this);
                this.model.on('cancelEdit', this.cancelEdit, this);


                this.model.on('saveEdit', this.saveEdit, this);

              
                this.listItemTemplate = _.template($('#listItemTemplate').html());

            },

            // Re-rendering the App just means refreshing the statistics -- the rest
            // of the app doesn't change.
            render: function () {

                this.$el.html(this.listItemTemplate(this.model.toJSON()));
                //this.$el.enhanceWithin();
                //this.$el.find('input').button();
                return this;
            },
            remove: function () {
                var self = this;
                self.$el.remove();
            },
            removeProduct: function () {
                this.model.destroy();
            },
            edit: function () {
                this.model.isEditing = true;

                this.editingModel = this.model.clone();

                var tempObj = { p: this.model.toJSON(), s: this.collection.pluck("code") };
                //console.log(tempObj);
                this.$el.html(this.EditStockTableTrTemplate(tempObj));

                //this.$el.enhanceWithin();

                //this.$el.find('input').textinput();
                this.$el.find('input.input').textinput();
                this.$el.find('input.button').button();

                //if (this.model.get('supplier_default')) {
                //    this.$el.find('select').removeClass('not_chosen');
                //}

                var allSelectEl = this.$el.find('select.select-supplier');

                _.each(allSelectEl, function myfunction(el, index) {
                    var $el = allSelectEl.eq(index);
                    var value = $el.val();

                    if (value) {
                        $el.removeClass('not_chosen');
                    } else {
                        $el.addClass('not_chosen');
                    }
                });
            },
            editClick: function () {
                this.edit();
                $("#EditProductTable").tableHeadFixer({ "left": 1, "right": 2 });

            },
       
         
            removeClick: function () {
                //this.model.isEmty();
                var self = this;
                this.model.destroy(function (result) {
                    //this.model.remove();
                    if (result) { self.model.collection.remove(self.model) }
                    else {
                        alert('errror result=' + result)
                    }
                });
            },

        });
    });
})(jQuery);
