var printFunc = function () {
    var is_chrome = function () { return Boolean(window.chrome); }
    if (is_chrome) {
        window.print();
        setTimeout(function () { window.close(); }, 5000);
        //give them 10 seconds to print, then close
    }
    else {
        window.print();
        window.close();
    }
};

$(function () {

    window.createReportFunc = function (reportObj, cb) {
        var detail = reportObj.detail;
        var collection = reportObj.collection;
        $('#main h1').html('Andamania Beach Resort<br>Stock-Checking');
        $('#main .h_detail').html(detail);


        if (collection.length == 0) {
            return;
        }

        collection.comparator = function (model) {
            return model.get('code');
        }

        var allProductTable = new Backgrid.Grid({
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
            },
            {
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
          
             {
                 name: "unit",
                 label: "UnitCount",
                 cell: "string",
                 editable: false
             },
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

            collection: collection
        });

        $(".ReportTable").append(allProductTable.render().el);

        printFunc();
    };

});