/// <reference path="../../lib/jquery/jquery-2.1.1.js" />
/*global Backbone, jQuery, _, ENTER_KEY */
var app = app || { models: {}, collections: {}, views: {} };

(function ($) {
    'use strict';

    $(function () {
        app.views.CreateUserView = Backbone.View.extend({

            el: 'body',
            //className: 'listItem',


            events: {
                'click .createButton': 'createButtonClick',
            },

            initialize: function () {
                var self = this;
                //this.model.on('change', this.render, this);
                //this.model.on('destroy', this.remove, this);
                //this.model.on('removeUi', this.remove, this);
                //this.model.on('remove', this.remove, this);
                //this.collection.on('reset', this.render, this);
                //this.model.on('edit', this.edit, this);
                //this.model.on('cancelEdit', this.cancelEdit, this);
                //this.model.on('saveEdit', this.saveEdit, this);
                //this.model.on('change', this.render, this);

                //this.listItemTemplate = _.template($('#listItemTemplate').html());
                //this.template= _.template($('#ItemTemplate').html())

                self.userCollection = new app.collections.UsersCollection();

                self.userCollection.on('add', self.addOne, self);
                self.userCollection.on('reset', self.addAll, self);
                self.userCollection.getAll();


                self.listsCollection = new app.collections.ListsCollection();

                self.listsCollection.getAll(function (result) {
                    //console.log(self.listsCollection.toJSON());
                    //console.log(JSON.stringify(self.listsCollection));
                });

                self.createDialog = $("#dialog-form").dialog({
                    autoOpen: false,
                    height: 400,
                    width: 350,
                    //modal: true,
                    buttons: {
                        "Create User": function () {
                            self.createUser();
                        },
                        Cancel: function () {
                            self.createDialog.dialog("close");
                        }
                    },
                    close: function () {
                    }
                });

                var form = self.createDialog.find("form").on("submit", function (event) {
                    event.preventDefault();
                    createNewList();
                });

                $("#dialog-confirm").dialog({
                    autoOpen: false,
                    resizable: false,
                    height: "auto",
                    width: 400,
                    modal: true
                });

            },

            addOne: function (model) {
                var view = new app.views.CreateUserItemView({ model: model, collection: this.listsCollection });

                $('#UserView').append(view.render().el);
                //view.$el.find("button").button();
            },
            addAll: function () {
                $('#UserView').html(''); // clean the todo list
                this.userCollection.each(this.addOne, this);
                //$('#showLists').controlgroup()
            },

            createButtonClick: function () {
                this.createDialog.dialog("open");
            },
            createUser: function () {
                var self = this;
                var userType = $('#userType').val();
                var userName = $('#userName').val();
                var userPass = $('#userPass').val();

                //console.log(userType, userName, userPass);
                var userModel = new app.models.UserModel(
                    { user: userName, pass: userPass, type: userType, permission: {}, dpm: sessionStorage.dpm });

                userModel.save(function (result) {
                    if (result) {
                        self.userCollection.add(userModel);
                        self.createDialog.dialog("close");
                    } else {
                        alert(result);
                    }

                });

            }

        });
    });
})(jQuery);
