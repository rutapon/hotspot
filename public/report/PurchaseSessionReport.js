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
        var model = reportObj.model;
        //var collection = reportObj.collection;
        $('#main h2').html('Andamania Beach Resort<br>Purchase Summary Report');
        $('#main .h_detail').html(detail);

        // if (collection.length == 0) {
        //     return;
        // }
        // collection.comparator = function (model) {
        //     return model.get('code');
        // }

        // var purchaseSessionShowView =  new app.views.PurchaseSessionShow({
        //     el: '.PurchaseSessionShow',
        //     model: model,
        //     collection: collection
        // });
        // purchaseSessionShowView.render();

        _.each(reportObj.allReportCollection, function (purchaseSessionShowView) {
            $('.PurchaseSessionShowResult').append($(purchaseSessionShowView.el).clone());
        })

        printFunc();
    };

});