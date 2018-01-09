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
        var allReportCollection = reportObj.allReportCollection;
        $('#main h1').html('Andamania Beach Resort<br>Purchase Supplier');
        $('#main .h_detail').html(detail);

        _.each(allReportCollection, function (collection) {

            if (collection.length == 0) {
                return;
            }

            //var code = collection.selectProduct.get('code');
            //var name = collection.selectProduct.get('name');
            //var unit_type = collection.selectProduct.get('unit_type');
            var eachView = new app.views.ReportPurchaseSupplierEach({ collection: collection});
            eachView.renderObj = collection.renderObj;
            var eachViewEl = eachView.render().el;
            $('.ReportPurchaseSupplierResult').append(eachViewEl);
        });

        printFunc();
    };

});