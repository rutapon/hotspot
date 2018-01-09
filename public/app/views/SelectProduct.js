/// <reference path="../../lib/jquery/jquery-2.1.1.js" />
/*global Backbone, jQuery, _, ENTER_KEY */
var app = app || { models: {}, collections: {}, views: {} };

(function ($) {
    'use strict';

    $(function () {
        app.views.SelectProduct = Backbone.View.extend({

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
                this.stockSelected = this.model.get('stockModel');
                var selectProductCollection = this.selectProductCollection = this.model.get('selectProductCollection');
                this.importProductCollection = this.model.get('importProductCollection');

                selectProductCollection.comparator = function (model) {
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

                    collection: selectProductCollection
                });

                this.$el.find(".select-result").append(this.allProductTable.render().el);

                this.$el.on("popupafteropen", function (event, ui) {
                    console.log('popupafteropen');
                    self.search();
                });

                this.$el.on("popupafterclose", function (event, ui) {
                    console.log('popupafterclose');
                    self.clear();
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
                this.lastText = null;
                this.$el.find('.select_product_search').val('');
                this.allProductTable.clearSelectedModels();
                this.selectProductCollection.reset();
            },
            resetFromService: function (result, stockSelected) {
                //var self = this;
                this.selectProductCollection.reset(result);
                if (this.selectProductCollection.length == 1) {
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
                selectedModels = _.compact(selectedModels);

                this.clear();

                this.trigger('select', selectedModels);

                for (var i in selectedModels) {
                    var product = selectedModels[i];
                    this.model.addImportProduct(product);
                }

                //console.log(selectedModels.length);
                //this.collection.saveToXlsx(this.model.stockModel.get('stock_selected') + "#" + this.$el.find('.show_product_search').val());

            },
            cancelClick: function () {
                this.clear();
            },

            search: function (ev) {
             
                var self = this;

                var searchText = this.$el.find('.select_product_search').val();// $(ev.target).val();
                searchText = searchText.trim();

                var stockSelected = this.stockSelected.get('stock_selected');

                var supplierSelected = null;

                if (app.userModel.get('type') != 'staff_support') {
                    supplierSelected = $('select.select-supplier-in').val(); // self.supplierSelected;
                }
               
                //console.log('search', searchText);
                if (searchText && (!this.lastText || this.lastText != searchText)) {
                    self.lastText = searchText;
                
                    //var stockSelected = this.model.stockModel.get('stock_selected'); //$('.select-stock  option:selected').select().text();
                    //console.log(searchText + ' product ' + stockSelected);
                    //this.allProductTable.clearSelectedModels();

                    self.selectProductCollection.search(searchText, stockSelected, function () {

                        if (self.selectProductCollection.length == 1) {
                            var model = self.selectProductCollection.at(0);
                            model.trigger("backgrid:select", model, true);
                            self.selectClick();
                            $("#popupSelectProduct").popup('close', { transition: 'flow' });
                        }
                    }, supplierSelected);

                } else {
                    console.log('select product search getAll',searchText,stockSelected);
                    self.lastText = false;
                    self.selectProductCollection.getAll(stockSelected, function (result) {
                        //self.selectProductCollection.setLocalDatabase(stockSelected, result);
                    }, supplierSelected);
                    //this.selectProductCollection.reset();
                }
            }
        });
    });

})(jQuery);
