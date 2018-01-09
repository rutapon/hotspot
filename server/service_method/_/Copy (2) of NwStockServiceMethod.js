/// <reference path="../../lib/NwLib.js" />
/// <reference path="../../lib/underscore/underscore.js" />
/// <reference path="../NwServiceProcess.js" />
/// <reference path="../NwConn/NwSqliteConnection.js" />

(function (context, undefined) {
    //#region requre

    if (typeof module !== "undefined") {
        NwLib = require('../../lib/NwLib.js');
        _ = require('../../lib/underscore/underscore.js');
        Class = NwLib.Nwjsface.Class;

        //sqlite3 = require('sqlite3').verbose();
        NwSqliteConnection = require('../NwConn/NwSqliteConnection.js');
        NwServiceProcess = require('../NwServiceProcess.js');
    } else {

    }
    //#endregion
    //var NwStockServiceMethod = Class(function () {
    //    var stock1 = new NwSqliteConnection('../Database/stock1.s3db');
    //    return {
    //        $singleton: true,
    //        constructor: function (dbPath) {
    //            this.dbPath = dbPath;
    //        },

    //        getAllProducts: function (stockName) {

    //        }

    //    };
    //});


    var productTableName = 'products';
    var supplyLogTableName = 'supply_log';

    var importProductTableName = 'product_in';

    var stocks = {};
    stocks['Store-ใหญ่'] = new NwSqliteConnection(__dirname + '/../Database/stock/stock.s3db');
    stocks['Store-ช่าง'] = new NwSqliteConnection(__dirname + '/../Database/stock/Copy of stock.s3db');
    stocks['Store-ทดสอบ'] = new NwSqliteConnection(__dirname + '/../Database/stock/Copy (2) of stock.s3db');

    //stocks['ทดสอบ stock 123'] = new NwSqliteConnection(__dirname + '/../Database/stock/ทดสอบ stock 123.s3db');

    var getStock = function (stockName) {
        return stocks[stockName];
    }

    var NwStockServiceMethod = {

        getAllStockName: function (data, cb) {
            if (cb) { cb(_.keys(stocks)) };
        },
        getAllProducts: function (data, cb) {
            var stockName = data.stockName;
            var stock = getStock(stockName);
            if (stockName) {
                stock.getAll(productTableName, function (result) {

                    if (cb) { cb(result) }
                });
            }
        },
        findeProductStartWith: function (data, cb) {
            var stockName = data.stockName;
            var findWord = data.findWord;
            var limit = data.limit ? data.limit : 20;
            //var stock = new NwSqliteConnection(__dirname + '/../Database/stock/stock1.s3db'); //getStock(stockName);
            var stock = getStock(stockName);
            stock.findStartWith(productTableName, { code: findWord, name: findWord }, limit, function (result) {
                if (cb) { cb(result) }
            });
        },
        insertProduct: function (data, cb) {
            var stockName = data.stockName;

            var code = data.code;
            var name = data.name;
            var unit_type = data.unit_type;
            var unit_size = data.unit_size;

            var description = data.description;

            var create_by = data.create_by;
            var create_datetime = new Date().toISOString().replace('T', ' ').substr(0, 19);

            var supplier_default = data.supplier_default;
            var unit_price_default = data.unit_price_default;

            var insertObj = {
                code: code, name: name, unit_type: unit_type, unit_size: unit_size, description: description,
                create_by: create_by, create_datetime: create_datetime,
                supplier_default: supplier_default, unit_price_default: unit_price_default
            };

            var stock = getStock(stockName);
            stock.insert(productTableName, insertObj, function (result) {
                if (cb) { cb(result) }
            })
        },

        updateProduct: function (data, cb) {
            var stockName = data.stockName;
            var id = data.id;

            var code = data.code;
            var name = data.name;
            var unit_type = data.unit_type;
            var unit_size = data.unit_size;
            var description = data.description;

            var create_by = data.create_by;
            var create_datetime = data.create_datetime;

            var supplier_name_default = data.supplier_name_default;
            var unit_price_default = data.unit_price_default;

            var dataObj = {
                code: code, name: name, unit_type: unit_type, unit_size: unit_size, description: description,
                create_by: create_by, create_datetime: create_datetime,
                supplier_name_default: supplier_name_default, unit_price_default: unit_price_default
            };

            var stock = getStock(stockName);
            stock.update(productTableName, { id: id }, dataObj, function (result) {
                if (cb) { cb(result) }
            })
        },

        deleteProduct: function (data, cb) {
            var stockName = data.stockName;
            var id = data.id;

            var stock = getStock(stockName);
            stock.destroy(productTableName, { id: id }, function (result) {
                if (cb) { cb(result) }
            })
        },

        insertSupplyLog: function (data, cb) {
            var stockName = data.stockName;

            var dataObj = {
                product_id: data.product_id,
                supplier_name: data.supplier_name,
                unit_price: data.unit_price,
                create_by: data.create_by,
                create_datetime: new Date().toISOString().replace('T', ' ').substr(0, 19)
            };

            var stock = getStock(stockName);
            stock.insert(supplyLogTableName, dataObj, function (result) {
                if (cb) { cb(result) }
            })
        },

        checkForInsertSupplyLog: function (data, cb) {
            var self = this;
            var stockName = data.stockName;

            var findObj = {
                product_id: data.product_id,
                supplier_name: data.supplier_name,
                unit_price: data.unit_price
            }

            var stock = getStock(stockName);
            stock.findOne(supplyLogTableName, findObj, function (result) {

                if (result) {
                    if (cb) { cb(false) }
                } else {
                    self.insertSupplyLog(data, cb);
                }
            });
        },

        updateSupplyLog: function (data, cb) {
            var stockName = data.stockName;
            var id = data.id;

            var dataObj = {
                product_id: data.product_id,
                supplier_name: data.supplier_name,
                unit_price: data.unit_price,
                create_by: data.create_by,
                create_datetime: data.create_datetime
            };

            var stock = getStock(stockName);
            stock.update(supplyLogTableName, { id: id }, dataObj, function (result) {
                if (cb) { cb(result) }
            })
        },
        findeSupplyLog: function (data, cb) {
            var stockName = data.stockName;
            delete data.stockName;

            //var product_id = data.product_id;{ product_id: product_id }
            var db = getStock(stockName);
            if (data.limit) {
                db.findLimit(supplyLogTableName, data, data.limit, function (result) {
                    if (cb) { cb(result) }
                });
            } else {
                db.find(supplyLogTableName, data, function (result) {
                    if (cb) { cb(result) }
                });
            }
        },
        getAllSupplyLog: function (data, cb) {
            var stockName = data.stockName;

            getStock(stockName).getAll(supplyLogTableName, function (result) {

                if (cb) { cb(result) }
            });

        },

        insertImportProduct: function (data, cb) {
            var stockName = data.stockName;

            //var dataObj = {
            //    product_id: data.product_id,
            //    invoid_id:invoid_id,
            //    supplier_name: data.supplier_name,
            //    unit_price: data.unit_price,
            //    unit: unit,
            //    in_date:in_date,
            //    create_by: data.create_by,
            //    create_datetime: new Date().toISOString().replace('T', ' ').substr(0, 19)
            //};

            var dataObj = _.pick(data, ['product_id', 'invoid_id', 'supplier_name', 'unit_price', 'unit', 'in_date', 'create_by']);
            dataObj.create_datetime = new Date().toISOString().replace('T', ' ').substr(0, 19);


            var stock = getStock(stockName);
            stock.insert(importProductTableName, dataObj, function (result) {

                var supplier_name_default = data.supplier_name;
                var unit_price_default = data.unit_price;

                stock.update(productTableName, { id: data.product_id }, { supplier_name_default: supplier_name_default, unit_price_default: unit_price_default }, function (result) {
                    if (cb) { cb(result) }
                })

                //if (cb) { cb(result) }
            })
        },


    };


    if (typeof module !== "undefined" && module.exports) {                       // NodeJS/CommonJS
        module.exports = NwStockServiceMethod;
    } else {

        context.NwStockServiceMethod = NwStockServiceMethod;
    }

})(this);