/// <reference path="../../lib/jquery/jquery-2.1.1.js" />
/*global Backbone, jQuery, _, ENTER_KEY */
var app = app || { models: {}, collections: {}, views: {} };

(function ($) {
    'use strict';

    var menuStuctureObj = {

        'Account Create->Supplier-Create': { 'createSupplier': false, 'editSupplier': false },
        'Account Create->Item-Create': { 'createItem': false, 'showItem': false, 'editItem': false },

        'Purchase->Credit': { 'importProduct': false, 'editImportProduct': false },

        'Purchase->PettyCash': { 'importProduct': false, 'editImportProduct': false },
        'Purchase->SummaryCredit': false,
        'Purchase->SummaryPettyCash': false,

        'Stock->Stock-Out': { 'exportProduct': false, 'editExportProduct': false },
        'Stock->Stock-Checking': { 'checkProduct': false, 'editCheckProduct': false },

        'Report': {
            'ReportStockCard': false, 'ReportStockLasting': false, 'ReportCheckProduct': false,
            'ReportPurchaseSupplier': false, 'ReportPurchaseProduct': false
        }

    };


    function createPermissionDataObj(stuctureObj, permissionObj) {
        var dataObj = [];
        dataObj.push({ "id": '#all', "text": 'Menu', parent: "#", 'state': { 'open': false } });
        _.each(stuctureObj, function (item0, key0) {
            var parentObj = { "id": key0, "text": key0, parent: "#all" };
            dataObj.push(parentObj);
            if (_.isObject(item0)) {
                _.each(item0, function (item1, key1) {
                    var obj = { "id": key0 + '.' + key1, "text": key1, parent: key0, "icon": "jstree-file" };
                    if (permissionObj && permissionObj[key0] && permissionObj[key0][key1]) {
                        obj.state = { selected: true };
                    }

                    dataObj.push(obj);
                });
            } else if (permissionObj[key0]) {
                parentObj.state = { selected: true };
            }

        });
        return dataObj
    }
    function toMenuStucture(ids) {
        var resultObj = {};
        _.each(menuStuctureObj, function (item0, key0) {
            if (_.isObject(item0)) {
                _.each(item0, function (item1, key1) {
                    var id = key0 + '.' + key1;
                    if (_.indexOf(ids, id) > -1) {
                        var obj = {};
                        obj[key0] = {};
                        obj[key0][key1] = true;
                        $.extend(true, resultObj, obj);
                    }
                    //item0[key1] = _.indexOf(ids, id) > -1 ? true : false;
                });
            } else {
                var id = key0;
                if (_.indexOf(ids, id) > -1) {
                    var obj = {};
                    obj[key0] = true;
                    $.extend(true, resultObj, obj);
                }
            }
        });

        return resultObj;
    }

    function createListPermissionDataObj(stuctureObj, permissionObj) {
        var dataObj = [];
        dataObj.push({ "id": 'Store', "text": 'Store', parent: "#", 'state': { 'open': false } });
        dataObj.push({ "id": 'OE', "text": 'OE', parent: "#", 'state': { 'open': false } });

        _.each(stuctureObj, function (item) {
            var obj = { "id": item.listType + '-' + item.name, "text": item.name, parent: item.listType };
            var id = item.listType + '-' + item.name;
            if (_.indexOf(permissionObj, id) > -1) {
                obj.state = { selected: true };
            }
            dataObj.push(obj);
        });
        //console.log(dataObj, permissionObj);
        return dataObj;
    }
    function toListPermission(stuctureObj, ids) {
        var dataObj = [];
        _.each(stuctureObj, function (item) {
            var id = item.listType + '-' + item.name;
            if (_.indexOf(ids, id) > -1) {
                dataObj.push(id);
            }
        });
        return dataObj;
    }

    $(function () {

        app.views.CreateUserItemView = Backbone.View.extend({

            tagName: 'div',
            //className: 'listItem',
            template: _.template($('#ItemTemplate').html()),

            events: {

                'click .changePasswordButton': 'changePasswordClick',
                'click .removeButton': 'removeClick',
            },

            initialize: function () {
                var self = this;
                //this.model.on('change', this.render, this);
                //this.model.on('destroy', this.remove, this);
                //this.model.on('removeUi', this.remove, this);
                self.model.on('remove', this.remove, self);
                //this.collection.on('reset', this.render, this);
                //this.model.on('edit', this.edit, this);
                //this.model.on('cancelEdit', this.cancelEdit, this);
                //this.model.on('saveEdit', this.saveEdit, this);

                // _.bindAll(this, "render");
                //this.listItemTemplate = _.template($('#listItemTemplate').html());

                self.model.on('change', this.change, self);

                self.collection.on('reset', function () {

                    if (self.$el.find('.listPermission').jstree) {
                        //var tree = self.$el.find('.listPermission').jstree(true);
                        //console.log('data ',self.model.get('listAccessPermission'));

                        //tree.settings.core.data =
                        //tree.refresh();
                        self.renderListAccessPermission();
                    }
                });

            },

            renderMenuPermission: function () {
                var self = this;
                var dataObj = createPermissionDataObj(menuStuctureObj, self.model.get('permission'));

                self.$el.find('.jstree').jstree({
                    "checkbox": {
                        "keep_selected_style": false
                    },
                    "plugins": ["checkbox"],
                    'core': {
                        'data': dataObj
                    }
                }).on('changed.jstree', function (e, data) {


                    var tree = self.$el.find('.jstree').jstree(true);
                    var ids = tree.get_selected();
                    var permissionObj = toMenuStucture(ids);
                    var permission = self.model.get('permission');

                    if (!_.isEqual(permissionObj, permission)) {
                        var i, j, r = [];
                        for (i = 0, j = data.selected.length; i < j; i++) {
                            //r.push(data.selected[i] + ':' + data.instance.get_node(data.selected[i]).text);
                            if (data.selected[i] == '#all') {
                                tree.open_node('#all');
                            }
                        }
                        self.model.set('permission', permissionObj);

                    } else {
                        tree.close_node('#all');
                    }
                });

            },
            renderListAccessPermission: function () {
                var self = this;
                console.log('renderListAccessPermission');
                var listStuctureObj =
                    createListPermissionDataObj(self.collection.toJSON(), self.model.get('listAccessPermission'));


                //var dataObj = createListPermissionDataObj(self.collection.toJSON());
                //console.log(dataObj);
                self.$el.find('.listPermission').jstree({
                    "checkbox": {
                        "keep_selected_style": false
                    },
                    "plugins": ["checkbox"],
                    'core': {
                        'data': listStuctureObj
                    }
                }).on('changed.jstree', function (e, data) {
                    //console.log('change');

                    var tree = self.$el.find('.listPermission').jstree(true);
                    var ids = tree.get_selected();
                    var permissionObj = toListPermission(self.collection.toJSON(), ids);

                    if (!_.isEqual(permissionObj, self.model.get('listAccessPermission'))) {
                        var i, j, r = [];

                        for (i = 0, j = data.selected.length; i < j; i++) {
                            //r.push(data.selected[i] + ':' + data.instance.get_node(data.selected[i]).text);
                            if (data.selected[i] == 'Store' || data.selected[i] == 'OE') {
                                tree.open_node(data.selected[i]);
                            }
                        }
                        console.log('set', permissionObj);
                        self.model.set('listAccessPermission', permissionObj);

                    } else {
                        tree.close_node('Store');
                        tree.close_node('OE');
                    }

                });
            },
            // Re-rendering the App just means refreshing the statistics -- the rest
            // of the app doesn't change.
            render: function () {
                //console.log('render');
                var self = this;
                self.$el.html(self.template(self.model.toJSON()));
                //self.model.set('permission', { 'OE': { 'createOE': true, 'editOE': true } });
                self.renderMenuPermission();

                if (self.collection.toJSON().length) {
                    self.renderListAccessPermission();
                }
                return this;
            },
            change: function (e) {
                //console.log('change', e);
                var self = this;
                if (e.changed.permission) {

                } else if (e.changed.pass) {
                    self.$el.find('.userPassword').text(e.changed.pass);
                }

                self.model.update();
            },
            remove: function () {
                var self = this;
                self.$el.remove();
            },
            changePasswordClick: function () {
                var pass = prompt("Please enter new password.", this.model.get('pass'));

                if (pass == null || pass == "") {
                    alert('No Data');
                } else {
                    this.model.set('pass', pass);
                }
            },
            removeClick: function () {
                //this.model.isEmty();
                var self = this;

                var self = this;
                $("#dialog-confirm").dialog("option", "buttons", {
                    "Delete Item": function () {

                        self.model.destroy(function (result) {
                            //this.model.remove();
                            if (result) {
                                self.model.collection.remove(self.model);
                            }
                            else {
                                alert('errror result=' + result)
                            }
                        });

                        $(this).dialog("close");
                    },
                    Cancel: function () {
                        $(this).dialog("close");
                    }
                }).dialog("open");
            },

        });
    });
})(jQuery);
