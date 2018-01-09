/// <reference path="../../lib/jquery/jquery-2.1.1.js" />
/*global Backbone, jQuery, _, ENTER_KEY */
var app = app || { models: {}, collections: {}, views: {} };

(function ($) {
    'use strict';

    $(function () {
        app.views.SelectProduct2 = Backbone.View.extend({

            // Instead of generating a new element, bind to the existing skeleton of
            // the App already present in the HTML.
            //el: '#showProductNav',

            // Delegated events for creating new items, and clearing completed ones.
            events: {
                'keyup .select_product_search': 'search',
                //'change .select_product_search': 'search',

                'click .selectClick': 'selectClick',
                'click .cancelClick': 'cancelClick'
            },

            initialize: function () {
                var self = this;
                this.stockSelected = this.model['stockModel'];
                var collection = this.collection = new app.collections.products();

                collection.comparator = function (model) {
                    return model.get('code');
                }

                //this.CreateProductTable = new app.views.CreateProductTable({ collection: this.collection }).render();

                this.allProductTable = new Backgrid.Grid({
                    columns: [
                    //    {

                    //    // name is a required parameter, but you don't really want one on a select all column
                    //    name: "",

                    //    // Backgrid.Extension.SelectRowCell lets you select individual rows
                    //    cell: "select-row",

                    //    // Backgrid.Extension.SelectAllHeaderCell lets you select all the row on a page
                    //    headerCell: "select-all",

                    //},
                    {
                        name: "code",
                        label: "Code",
                        cell: "string",
                        editable: false
                    }, {
                        name: "name",
                        label: "Description",
                        cell: "string",
                        editable: false
                    },
                    {
                        name: "unit_type",
                        label: "UnitType",
                        cell: "string",
                        editable: false
                    },
                    //{
                    //    name: "unit_size",
                    //    label: "ขนาด",
                    //    cell: "string",
                    //    editable: false
                    //},
                    //{
                    //    name: "description",
                    //    label: "รายละเอียด",
                    //    cell: "string",
                    //    editable: false
                    //},
                    {
                        // enable the select-all extension
                        name: "",
                        cell: "select-row",
                        headerCell: "select-all"
                    }
                     //{
                     //    name: "edit",
                     //    label: "edit",
                     //    cell: Backgrid.SelectCell.extend({
                     //        // It's possible to render an option group or use a
                     //        // function to provide option values too.
                     //        optionValues: [["Male", "m"], ["Female", "f"]]
                     //    })
                     //}
                    ],
                    SelectCell: {
                        multiple: false
                    },

                    collection: collection
                });

                //collection.on('backgrid:selected', function (model, checked) {
                //    //console.log('backgrid:checked', model, checked);
                //    if (checked) {
                //        self.clear();
                //        self.trigger('select', [model]);
                //    }

                //})

                this.$el.find(".select-result").append(this.allProductTable.render().el);

                this.$el.on("popupafteropen", function (event, ui) {
                    console.log('popupafteropen');
                    self.search();
                });
            },

            // Re-rendering the App just means refreshing the statistics -- the rest
            // of the app doesn't change.
            render: function () {

            },

            showAllProduct: function () {
                var self = this;
                var stockSelected = this.stockSelected.get('stock_selected'); //$('.select-stock  option:selected').select().text();
                app.serviceMethod.getAllProducts(stockSelected, function (result) {
                    self.resetFromService(result, stockSelected);
                });
            },
            clear: function () {
                this.lastText = false;
                this.$el.find('.select_product_search').val('');
                this.allProductTable.clearSelectedModels();
                this.collection.reset(null);
            },
            resetFromService: function (result, stockSelected) {
                //var self = this;
                this.collection.reset(result);
                if (this.collection.length == 1) {
                    console.log('lenght');
                    var model = this.collection.at(0);
                    model.trigger("backgrid:select", model, true);
                }

                //this.collection.each(function (model, i) {
                //    if (i % 2 == 0) model.trigger("backgrid:select", model, true);
                //});

                //for (var i in result) {
                //    result[i]['stock_name'] = stockSelected;
                //    result[i]['id_instock'] = result[i]['id'];
                //    delete result[i]['id'];
                //    //$('body').append(JSON.stringify(result[i]) + '<br>');
                //    self.collection.add(result[i]);
                //}
            },

            selectClick: function () {
                var selectedModels = this.allProductTable.getSelectedModels();

                this.trigger('select', selectedModels);

                //console.log(selectedModels.length);
                //this.collection.saveToXlsx(this.model.stockModel.get('stock_selected') + "#" + this.$el.find('.show_product_search').val());

                this.clear();
            },

            cancelClick: function () {
                this.clear();
            },

            search: function (ev) {
                var searchText = this.$el.find('.select_product_search').val();// $(ev.target).val();
                searchText = searchText.trim()
                   var stockSelected = this.stockSelected.get('stock_selected');
                if (searchText && (!this.lastText || this.lastText != searchText)) {
                    var self = this;
                 
                    //var stockSelected = this.model.stockModel.get('stock_selected'); //$('.select-stock  option:selected').select().text();
                    //console.log(searchText + ' product ' + stockSelected);
                    this.allProductTable.clearSelectedModels();

                    this.collection.search(searchText, stockSelected, function () {
                        if (self.collection.length == 1) {
                            var model = self.collection.at(0);
                            model.trigger("backgrid:select", model, true);
                        }
                    });

                } else {
                    this.lastText = false;
                    this.collection.getAll(stockSelected, function (result) {

                    });
                 
                    //this.collection.reset();
                }
            }
        });
    });

})(jQuery);
