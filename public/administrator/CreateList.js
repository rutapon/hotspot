if (typeof (Storage) !== "undefined") {
    // Code for localStorage/sessionStorage.

    if (sessionStorage.user && sessionStorage.type == 'admin') {

        app.userModel = new app.models.UserModel(JSON.parse(sessionStorage.userModelattributes));
        //console.log(app.userModel);   

    }
    else {
        //app.userModel = new app.models.UserModel({ permission: {} });
        //$(".setting-panel").panel("open");
        window.location.href = '/administrator/'
    }

    //pagecontainerchange();
    //checkMenuPermission();

} else {
    alert('Sorry! No Web Storage support..');
}


$(function () {
    $('#dpmName').text(sessionStorage.dpm);
   
    $("button").button();
    //$("#radioset").buttonset();

    //$(".controlgroup").controlgroup();
    //$("#button").button();

    $("#button-icon").button({
        icon: "ui-icon-gear",
        showLabel: false
    });

    //$("input").checkboxradio();

    //$("#list-type").selectmenu();

    //$("#speed").selectmenu();

    var createNewList = function () {
        var name = $('#name').val();
        var listtype = $('#list-type').val()

        var valid = true;

        valid = name && listtype ? true : false;
        if (valid) {
            //app.listsCollection.create();
            var listModel = new app.models.ListModel({ name: name, listType: listtype });
            listModel.save(function (result) {
                console.log(result);
                if (result) {
                    app.listsCollection.add(listModel);
                } else {
                    alert("Can not save");
                }
            })

        }
        //alert("Create " + valid + ':' + name + ' ' + listtype)
        dialog.dialog("close");
    }

    var dialog = $("#dialog-form").dialog({
        autoOpen: false,
        height: 400,
        width: 350,
        //modal: true,
        buttons: {
            "Create an account": createNewList,
            Cancel: function () {
                dialog.dialog("close");
            }
        },
        close: function () {
        }
    });

    var form = dialog.find("form").on("submit", function (event) {
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


    //form = dialog.find("form").on("submit", function (event) {
    //    event.preventDefault();
    //    addUser();
    //});

    $("#create-list").button().on("click", function () {
        dialog.dialog("open");
    });




    // instance of the Collection
    app.listsCollection = new app.collections.ListsCollection();

    //--------------
    // Views
    //--------------

    // renders individual todo items list (li)
    app.ListItemView = Backbone.View.extend({
        tagName: 'div',
        template: _.template($('#listItemTemplate').html()),
        render: function () {
            this.$el.html(this.template(this.model.toJSON()));

            //this.$el = $(this.$el).controlgroup();

            //this.input = this.$('.edit');
            return this; // enable chained calls
        },
        initialize: function () {
            this.model.on('change', this.render, this);
            //this.model.on('destroy', this.remove, this); // remove: Convenience Backbone's function for removing the view from the DOM.
            this.model.on('remove', this.remove, this);

        },
        events: {
            //'dblclick label': 'edit',
            //'keypress .edit': 'updateOnEnter',
            //'blur .edit': 'close',
            //'click .toggle': 'toggleCompleted',
            'click .destroy': 'destroy'
        },
        edit: function () {
            this.$el.addClass('editing');
            this.input.focus();
        },
        close: function () {
            var value = this.input.val().trim();
            if (value) {
                this.model.save({ name: value });
            }
            this.$el.removeClass('editing');
        },
        updateOnEnter: function (e) {
            if (e.which == 13) {
                this.close();
            }
        },
        toggleCompleted: function () {
            this.model.toggle();
        },
        remove: function () {
            var self = this;
            self.$el.remove();
        },
        destroy: function () {
            var self = this;
            $("#dialog-confirm").dialog("option", "buttons", {
                "Delete Item": function () {

                    self.model.destroy();
                    self.model.collection.remove(self.model)

                    $(this).dialog("close");
                },
                Cancel: function () {
                    $(this).dialog("close");
                }
            }).dialog("open");
        }
    });

    // renders the full list of todo items calling ListItemView for each one.
    app.AppView = Backbone.View.extend({
        el: '#body',
        initialize: function () {
            //this.input = this.$('#new-todo');
            app.listsCollection.on('add', this.addOne, this);
            app.listsCollection.on('reset', this.addAll, this);
            //app.listsCollection.fetch(); // Loads list from local storage
            this.addAll();
            app.listsCollection.getAll();
        },
        events: {
            //'keypress #new-todo': 'createTodoOnEnter'
        },
        createTodoOnEnter: function (e) {
            if (e.which !== 13 || !this.input.val().trim()) { // ENTER_KEY = 13
                return;
            }
            createNewList();
            //app.listsCollection.create(this.newAttributes());
            //this.input.val(''); // clean input box
        },
        addOne: function (todo) {
            var view = new app.ListItemView({ model: todo });

            $('#showLists').append(view.render().el);
            view.$el.find("button").button();
            //setTimeout(function () {
            //    $('#showLists').find("button").button();
            //}, 1);
        },
        addAll: function () {
            $('#showLists').html(''); // clean the todo list
            app.listsCollection.each(this.addOne, this);
            //$('#showLists').controlgroup()


        },
        newAttributes: function () {
            return {
                name: this.input.val().trim(),
                listType: false
            }
        }
    });

    //--------------
    // Initializers
    //--------------   

    app.appView = new app.AppView();

});
