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
        $('#main h1').html('Andamania Beach Resort<br>Stock Checking Report');
        $('#main .h_detail').html(detail);


        if (collection.length == 0) {
            return;
        }

        collection.comparator = function (model) {
            return model.get('code');
        }

        var allProductTable = new Backgrid.Grid({
            columns: [
                    {
                        name: "code",
                        label: "รหัสสินค้า",
                        cell: "string",
                        editable: false
                    },
                    {
                        name: "name",
                        label: "รายการสินค้า",
                        cell: "string",
                        editable: false
                    },
                     {
                         name: "unit_type",
                         label: "หน่วย",
                         cell: "string",
                         editable: false
                     },

                    {
                        name: "unit_price",
                        label: "ราคา",
                        cell: "string",
                        editable: false
                    },

                     {
                         name: "unit",
                         label: "คงเหลือ",
                         cell: "string",
                         editable: false
                     },
                     //{
                     //    name: "sum",
                     //    label: "มูลค่าคงหลือ",
                     //    cell: "string",
                     //    editable: false
                     //},
                      {
                          name: "last_unit",
                          label: "ตรวจนับจริง",
                          cell: "string",
                          editable: false
                      },
                      {
                          name: "diff_unit",
                          label: "ผลต่าง",
                          cell: "string",
                          editable: false
                      },
                       {
                           name: "dif_sum",
                           label: "มูลค่าผลต่าง",
                           cell: "string",
                           editable: false
                       },
            ],

            collection: collection
        });

        $(".ReportTable").append(allProductTable.render().el);

        printFunc();
    };

});