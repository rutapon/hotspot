if (typeof (Storage) !== "undefined") {
    // Code for localStorage/sessionStorage.

    if (sessionStorage.user && sessionStorage.user == 'admin') {
        app.userModel = new app.models.UserModel(JSON.parse(sessionStorage.userModelattributes));
    }
    else {
        window.location.href = '/administrator/'
    }
} else {
    alert('Sorry! No Web Storage support..');
}

$(function () {
    $('#dpmName').text(sessionStorage.dpm);

    $("button").button();
    //$('[type=checkbox]').checkboxradio();


    var menuStuctureObj = {
        'OE': { 'createOE': false, 'editNav': false },
        'Supplier': { 'createSupplier': false, 'editSupplier': false },
        'Stock': { 'createItem': false, 'showItem': false, 'editItem': false },

        'OE-In': { 'importOE': false, 'editImportOE': false },
        'Stock-In': { 'importProduct': false, 'editImportProduct': false },

        'OE-In_PettyCash': { 'importOE': false, 'editImportOE': false },
        'Stock-In_PettyCash': { 'importProduct': false, 'editImportProduct': false },

        'Stock-Out': { 'exportProduct': false, 'editExportProduct': false },

        'Stock-Checking': { 'checkProduct': false, 'editCheckProduct': false },
        'Report': {
            'ReportStockCard': false, 'ReportStockLasting': false, 'ReportCheckProduct': false,
            'ReportPurchaseSupplier': false, 'ReportPurchaseProduct': false
        }

    };

    function createPermissionDataObj(menuStuctureObj) {
        var dataObj = [];
        dataObj.push({ "id": '#all', "text": 'Menu', parent: "#" });
        _.each(menuStuctureObj, function (item0, key0) {
            dataObj.push({ "id": key0, "text": key0, parent: "#all" });

            _.each(item0, function (item1, key1) {
                var obj = { "id": key0 + '.' + key1, "text": key1, parent: key0, "icon": "jstree-file" };
                if (item1) {
                    obj.state = { selected: true };
                }
                dataObj.push(obj);

            });
        });
        return dataObj
    }
    //function toMenuStucture(ids) {

    //    _.each(menuStuctureObj, function (item0, key0) {
    //        _.each(item0, function (item1, key1) {
    //            var id = key0 + '.' + key1;
    //            item0[key1] = _.indexOf(ids, id) > -1 ? true : false;
    //        });
    //    });

    //    return menuStuctureObj;
    //}

    function toMenuStucture(ids) {
        var resultObj = {};
        _.each(menuStuctureObj, function (item0, key0) {
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
        });

        return resultObj;
    }

    var dataObj = createPermissionDataObj(menuStuctureObj);



    $("#jstree").jstree({
        "checkbox": {
            "keep_selected_style": false
        },
        "plugins": ["checkbox"],
        'core': {

            'data': dataObj
        }
    }).on('changed.jstree', function (e, data) {
        var i, j, r = [];
        var tree = $('#jstree').jstree(true);
        for (i = 0, j = data.selected.length; i < j; i++) {
            //r.push(data.selected[i] + ':' + data.instance.get_node(data.selected[i]).text);
            if (data.selected[i] == '#all') {
                tree.open_node(data.selected[i]);
            }
        }
        var ids = tree.get_selected();
        //_.each(menuStuctureObj, function (item0, key0) {
        //    _.each(item0, function (item1, key1) {
        //        var id = key0 + '.' + key1;
        //        item0[key1] = _.indexOf(ids, id) > -1 ? true : false;
        //    });
        //});

        console.log(toMenuStucture(ids));
        //console.log('Selected: ' + r.join(', '));

        //$('button').on('click', function () {
        //    console.log('click');

        //    var ids = $('#jstree').jstree('get_selected', true)
        //    console.log(ids);
        //});

    });


    function refresh() {
        dataObj.push({ "id": "ajson331", "text": "Simple root 34234", "state": { "selected": true } });
        //$('#jstree').jstree('select_node', 'ajson1');
        var tree = $('#jstree').jstree(true);
        tree.settings.core.data = dataObj;

        //$('#jstree').jstree("refresh");
        tree.refresh();
    }


    var createUserItemViewObj = new app.views.CreateUserView();

});