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

    app.views.ReportStockCardReport = app.views.ReportStockCard.extend({
        events: {

        },
        initialize: function () {
            var self = this;

            this.productCollection = new app.collections.products();

            //this.productCollection.on('add', this.addOne, this);
            //this.productCollection.on('reset', this.resetProduct, this);

            this.allReportCollection = [];

            //this.collection = new app.collections.ReportCollection();
            //this.collection.comparator = function (model) {
            //    return model.get('date');
            //}
        },
    });

    window.createReportFunc = function (reportObj, cb) {
        var detail = reportObj.detail;
        var allReportCollection = reportObj.allReportCollection;
        $('#main h1').html('Andamania Beach Resort<br>Stock Movement');
        $('#main .h_detail').html(detail);

        _.each(allReportCollection, function (collection) {

            if (collection.length == 0) {
                return;
            }

            var product = collection.selectProduct;

            //var code = collection.selectProduct.get('code');
            //var name = collection.selectProduct.get('name');
            //var unit_type = collection.selectProduct.get('unit_type');
            var eachView = new app.views.ReportStockCardEach({ collection: collection, model: product });

            var eachViewEl = eachView.render().el;
            $('.ReportStockCardResult').append(eachViewEl);
        });

        printFunc();
    };

});