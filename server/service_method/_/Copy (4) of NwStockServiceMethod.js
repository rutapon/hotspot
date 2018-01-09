/// <reference path="../../lib/NwLib.js" />
/// <reference path="../../lib/underscore/underscore.js" />
/// <reference path="../NwConn/NwDbConnection.js" />
/// <reference path="../NwServiceProcess.js" />


(function (context, undefined) {
    //#region requre

    if (typeof module !== "undefined") {
        NwLib = require('../../lib/NwLib.js');
        _ = require('../../lib/underscore/underscore.js');
        Class = NwLib.Nwjsface.Class;

        //sqlite3 = require('sqlite3').verbose();
        NwDbConnection = require('../NwConn/NwDbConnection.js');
        NwServiceProcess = require('../NwServiceProcess.js');

    } else {

    }
    //#endregion
    //var NwStockServiceMethod = Class(function () {
    //    var stock1 = new NwDbConnection('../Database/stock1.s3db');
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
    var exportProductTableName = 'product_out';
    var importSupplierTableName = 'supplier';

    var checkProductTableName = 'product_check';

    var supplyLogDataField = ['product_code', 'supplier_code', 'unit_price'];

    var supplierDataField = ['code', 'name', 'credit', 'address'];

    var productDataField = [
               'code',
               //'name',
               'nameTh',
               'nameEn',
               'unit_type',
               'description',
               'stock_name',
               'supplier_default',
               'unit_price_default',
               'supplier1',
               'unit_price1',
               'supplier2',
               'unit_price2',
               'supplier3',
               'unit_price3'
    ];

    var importProductDataField = [
                'code',
                'supplier_code',
                'unit_price',
                'unit',
                'in_date',
                'invoid_id',
                'sum',
                'stock_name'
    ]

    var exportProductDataField = [
                'code',
                //'supplier_code',
                //'unit_price',
                'unit',
                'out_date',
                'requisition_id',
                //'sum',
                'job',
                'stock_name'
    ];

    var checkProductDataField = ['code', 'unit', 'check_date', 'stock_name'];

    var stocks = {};

    //var stocksName = ['Store-Main', 'Store-Engineer', 'Store-HK', 'Store-Test'];
    var stockDataObj = {
        'resort': ['Store-Main', 'Store-Engineer', 'Store-HK', 'Store-Test'],
        'shop': ['Store-Main']
    }
    var dbPath = __dirname + '/../../Database/linvodb/';


    function requireUncached(module) {
        delete require.cache[require.resolve(module)]
        return require(module)
    }

    var userData = requireUncached('./userData.js');

    //_.each(socksName, function (sn) {

    //});

    //var globalDB = new NwDbConnection(dbPath + 'globalDB');

    //async.eachSeries(stocksName, function (sn, callback) {

    //    console.log('create', sn);
    //    stocks[sn] = new NwDbConnection(dbPath + sn);
    //    stocks[sn].initDB(function () {
    //        callback();
    //    });
    //});

    async.eachSeries(_.keys(stockDataObj), function (dpm, callback0) {
        var eachStockList = stockDataObj[dpm];

        var dbName = dpm + '@globalDB';

        stocks[dbName] = new NwDbConnection(dbPath + dbName);
        stocks[dbName].initDB(function () {

            async.eachSeries(eachStockList, function (sn, callback) {
                dbName = dpm + '@' + sn;
                console.log('create', dbName);
                stocks[dbName] = new NwDbConnection(dbPath + dbName);
                stocks[dbName].initDB(function () {
                    callback();
                });
            }, function () {
                callback0();
            });
        });

    }, function () {

        async.eachSeries(_.keys(userData), function (userName, callback0) {
            var userDataObj = userData[userName];
            console.log('userName', userName);

            if (userDataObj.type == 'staff_support') {
                async.eachSeries(_.keys(userDataObj.storeAccess), function (dpm, callback1) {
                    var storeAccessList = userDataObj.storeAccess[dpm];
                    console.log('dpm', dpm);
                    async.eachSeries(storeAccessList, function (sa, callback) {
                        if (_.has(stocks, dpm + '@' + sa)) {
                            var dbName = dpm + '@' + sa + '--by--' + userName;
                            console.log('create', dbName);
                            stocks[dbName] = new NwDbConnection(dbPath + dbName);
                            stocks[dbName].initDB(function () {
                                callback();
                            });
                        }
                        else { callback(); }

                    }, function () {
                        callback1();
                    });

                }, function () {
                    callback0();
                });
            } else {
                callback0();
            }
        });

    });

    //stocks['Store-ช่าง'] = new NwDbConnection(__dirname + '/../Database/stock/stock2');getStock(stockName, data.dpm, true);
    //stocks['Store-ทดสอบ'] = new NwDbConnection(__dirname + '/../Database/stock/stock3');

    //stocks['ทดสอบ stock 123'] = new NwDbConnection(__dirname + '/../Database/stock/ทดสอบ stock 123.s3db');

    var getStock = function (stockName, dqm, isForceUseMainDb) {

        if (isForceUseMainDb && stockName.indexOf('--by--') > -1) {
            stockName = stockName.split('--by--')[0];
        }

        return stocks[dqm + '@' + stockName];
    }

    var NwStockServiceMethod = {

        login: function (data, cb) {
            console.log(data);
            var user = data.user;
            var pass = data.pass;
            var dpm = data.dpm;
            if (_.has(userData, user)) {
                var userDataObj = userData[user];

                if (userDataObj.pass == pass) {
                    if (userDataObj.type == 'admin' || _.has(userDataObj.storeAccess, dpm) || userDataObj.storeAccess == "all") {
                        data = _.extend(data, userDataObj);
                        if (cb) { cb(data) };
                        return;
                    }
                }

            }

            if (cb) {
                console.log('longin false ' + JSON.stringify(userData));
                cb(false)
            };
        },

        getAllStockName: function (data, cb) {
            var user = data.user;
            var pass = data.pass;
            var dpm = data.dpm;

            var stockList = stockDataObj[dpm];
            var userDataObj = userData[user];
            if (userDataObj.type == 'admin' || userDataObj.storeAccess == 'all') {
                //if (cb) { cb(_.keys(stockList)) };
                var allStockFullNames = _.keys(stocks);


                var relevanceStocks = [];
                _.each(allStockFullNames, function (eachName) {
                    var namePare = eachName.split('@');
                    if (namePare[0] == dpm && namePare[1] != 'globalDB') {
                        relevanceStocks.push(namePare[1]);
                    }
                });

                if (cb) { cb(relevanceStocks) };

            }
            else if (userDataObj.type == 'staff_support') {
                var stockAccessList = _.intersection(stockList, userDataObj.storeAccess[dpm]);
                stockAccessList = _.map(stockAccessList, function (eachStockName) {
                    return eachStockName + '--by--' + user;
                });
                //console.log('userDataObj.storeAccess', userDataObj.storeAccess, stockAccessList);
                if (cb) { cb(stockAccessList) };
            }
            else {
                var stockAccessList = _.intersection(stockList, userDataObj.storeAccess[dpm]);
                //console.log('userDataObj.storeAccess', userDataObj.storeAccess, stockAccessList);
                if (cb) { cb(stockAccessList) };
            }

        },

        //#region Products
        getProduct: function (data, cb) {
            //console.log('getProduct', data);
            var stockName = data.stock_name;
            var code = data.code;

            var stock = getStock(stockName, data.dpm, true);
            if (stockName) {
                stock.findOne(productTableName, { code: code }, function (result) {
                    var userDataObj = userData[data.user];
                    _.each(result, function (eachResult) { eachResult.name = userDataObj.lng == 'En' ? eachResult.nameEn : eachResult.nameTh; });
                    console.log(result);
                    if (cb) { cb(result) }
                });
            }
        },
        getProductByCodeArray: function (data, cb) {
            //console.log('getProduct', data);
            var stockName = data.stock_name;
            var codes = data.codes;

            var stock = getStock(stockName, data.dpm, true);
            if (stockName) {
                stock.find(productTableName, { code: { $in: codes } }, function (result) {
                    var userDataObj = userData[data.user];
                    _.each(result, function (eachResult) { eachResult.name = userDataObj.lng == 'En' ? eachResult.nameEn : eachResult.nameTh; });
                    if (cb) { cb(result) }
                });
            }
        },
        getAllProducts: function (data, cb) {
            console.log('getAllProducts', data);
            var stockName = data.stock_name;
            var stock = getStock(stockName, data.dpm, true);
            if (stockName) {
                stock.getAll(productTableName, function (result) {
                    var userDataObj = userData[data.user];
                    _.each(result, function (eachResult) {
                        eachResult.name = userDataObj.lng == 'En' ? eachResult.nameEn : eachResult.nameTh;
                    });


                    if (cb) { cb(result) }
                });
            }
        },
        findeProductStartWith: function (data, cb) {

            var stockName = data.stock_name;
            var findWord = data.findWord;
            var limit = data.limit ? data.limit : 20;
            //var stock = new NwDbConnection(__dirname + '/../Database/stock/stock1.s3db'); //getStock(stockName,data.dpm);
            var stock = getStock(stockName, data.dpm, true);
            stock.findStartWith(productTableName, { code: findWord, nameTh: findWord, nameEn: findWord }, limit, function (result) {
                var userDataObj = userData[data.user];
                _.each(result, function (eachResult) { eachResult.name = userDataObj.lng == 'En' ? eachResult.nameEn : eachResult.nameTh; });

                if (cb) { cb(result) }
            });
        },
        insertProduct: function (data, cb) {

            //console.log('insertProduct', data);

            var stockName = data.stock_name;

            //var code = data.code;
            //var name = data.name;
            //var unit_type = data.unit_type;
            //var unit_size = data.unit_size;

            //var description = data.description;

            //var create_by = data.create_by;
            //var create_datetime = new Date().toISOString().replace('T', ' ').substr(0, 19);

            //var supplier_default = data.supplier_default;
            //var unit_price_default = data.unit_price_default;

            //var insertObj = {
            //    code: data.code,
            //    name: data.name,
            //    unit_type: data.unit_type,
            //    //unit_size: unit_size,
            //    description: data.description,
            //    stock_name: data.stock_name,
            //    supplier_default: data.supplier_default,
            //    unit_price_default: data.unit_price_default,
            //};

            var insertObj = _.pick(data, productDataField);

            insertObj.createingLog = { creator: data.user, 'createDate': new Date() };
            var stock = getStock(stockName, data.dpm);

            stock.insert(productTableName, insertObj, function (result) {
                var userDataObj = userData[data.user];
                _.each(result, function (eachResult) { eachResult.name = userDataObj.lng == 'En' ? eachResult.nameEn : eachResult.nameTh; });
                if (cb) { cb(result); }
                //if (cb) { cb({ 'result': 's', id: result }) }
            })
        },

        updateProduct: function (data, cb) {
            var stockName = data.stock_name;
            var code = data.code;

            //var code = data.code;
            //var name = data.name;
            //var unit_type = data.unit_type;
            //var unit_size = data.unit_size;
            //var description = data.description;

            //var create_by = data.create_by;
            //var create_datetime = data.create_datetime;

            //var supplier_default = data.supplier_default;
            //var unit_price_default = data.unit_price_default;

            //var dataObj = {
            //    code: data.code,
            //    name: data.name,
            //    unit_type: data.unit_type,
            //    description: data.description,
            //    stock_name: data.stock_name,
            //    supplier_default: data.supplier_default,
            //    unit_price_default: data.unit_price_default,
            //};

            var dataObj = _.pick(data, productDataField);

            dataObj['createingLog.updater'] = data.user;
            dataObj['createingLog.updateDate'] = new Date();

            var stock = getStock(stockName, data.dpm);
            stock.update(productTableName, { code: code }, dataObj, function (result) {
                if (cb) { cb(result) }
            });
        },
        deleteProduct: function (data, cb) {
            var stockName = data.stock_name;
            var code = data.code;
            //console.log('deleteProduct', data);

            var stock = getStock(stockName, data.dpm);
            stock.destroy(productTableName, { code: code }, function (result) {
                if (cb) { cb(result) }
            })
        },

        addProductUnitNumber: function (data, cb) {
            var stock_name = data.stock_name;
            var code = data.code;

            var adding_number = parseInt(data.adding_number);
            var dataObj = {};
            dataObj['unitSum.' + stock_name] = adding_number;

            var stock = getStock(stock_name, data.dpm);
            stock.updateInc(productTableName, { code: code }, dataObj, function (result) {

                if (cb) { cb(result) }
            })
        },
        unsetProductUnitNumber: function (data, cb) {
            var stock_name = data.stock_name;
            var code = data.code;

            var stock = getStock(stock_name, data.dpm);
            stock.updateUnset(productTableName, { code: code }, 'unitSum.' + stock_name, function (result) {

                if (cb) { cb(result) }
            })
        },

        updateProductUnitNumber: function (data, cb) {
            var stock_name = data.stock_name;
            var code = data.code;

            var stock = getStock(stock_name, data.dpm);
            stock.sumValue(importProductTableName, { code: code }, 'unit', function (sumIn) {
                stock.sumValue(exportProductTableName, { code: code }, 'unit', function (sumOut) {
                    var sum = sumIn - sumOut;
                    var updateObj = {}; updateObj['unitSum.' + stock_name] = sum

                    stock.update(productTableName, { code: code }, updateObj, function () {
                        if (cb) { cb({ sum: sum, sumIn: sumIn, sumOut: sumOut }) }
                    });


                });

            });

        },

        checkDuplicateProduct: function (data, cb) {
            var stockName = data.stock_name;
            var code = data.code;

            //var insertObj = _.pick(data, productDataField);
            //insertObj.createingLog = { creator: 'admin', 'createDate': new Date() };

            var stock = getStock(stockName, data.dpm);
            stock.findOne(productTableName, { code: code }, function (result) {
                var isDuplicate = result ? true : false;
                if (cb) { cb(isDuplicate) }
            });
        },
        //#endregion

        //#region SupplyLog
        insertSupplyLog: function (data, cb) {
            //console.log('insertSupplyLog', data);
            var stockName = data.stock_name;

            //var dataObj = {
            //    //product_id: data.product_id,
            //    code: data.code,
            //    supplier_name: data.supplier_name,
            //    unit_price: data.unit_price,
            //    create_by: data.create_by,
            //    create_datetime: new Date().toISOString().replace('T', ' ').substr(0, 19)
            //};

            //var dataObj = {
            //    product_code: data.product_code,
            //    supplier_code: data.supplier_code,
            //    unit_price: data.unit_price,
            //    createingLog: { creator: 'admin', 'createDate': new Date() }
            //};

            var dataObj = _.pick(data, supplyLogDataField);

            dataObj.createingLog = { creator: data.user, 'createDate': new Date() };

            var stock = getStock(stockName, data.dpm);
            stock.insert(supplyLogTableName, dataObj, function (result) {
                if (cb) { cb(result) }
            })
        },

        checkForInsertSupplyLog: function (data, cb) {
            //console.log('checkForInsertSupplyLog', data);
            var self = this;
            var stockName = data.stock_name;

            var findObj = {
                //product_id: data.product_id,
                product_code: data.product_code,
                supplier_code: data.supplier_code,
                //unit_price: data.unit_price
            }

            var stock = getStock(stockName, data.dpm);
            //stock.findOne(supplyLogTableName, findObj, function (result) {

            //    if (result) {
            //        if (cb) { cb(false) }
            //    } else {
            //        self.insertSupplyLog(data, cb);
            //    }
            //});

            stock.findLastOne(supplyLogTableName, findObj, { 'createingLog.createDate': -1 }, function (result) {

                if (result && result.unit_price == data.unit_price) {
                    if (cb) { cb(false) }
                } else {
                    self.insertSupplyLog(data, cb);
                }
            });
        },

        updateSupplyLog: function (data, cb) {
            var stockName = data.stock_name;
            var _id = data._id;

            //var dataObj = {
            //    //product_id: data.product_id,
            //    product_code: data.product_code,
            //    supplier_code: data.supplier_code,
            //    unit_price: data.unit_price
            //};

            var dataObj = _.pick(data, supplyLogDataField);

            dataObj['createingLog.updater'] = data.user;
            dataObj['createingLog.updateDate'] = new Date();

            var stock = getStock(stockName, data.dpm);
            stock.update(supplyLogTableName, { _id: _id }, dataObj, function (result) {
                if (cb) { cb(result) }
            })
        },
        findeSupplyLog: function (data, cb) {

            var stockName = data.stock_name;
            delete data.stock_name;
            //console.log('findeSupplyLog', data);
            //var product_id = data.product_id;{ product_id: product_id }
            var db = getStock(stockName, data.dpm);
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

        getLastSupplyLog: function (data, cb) {
            //console.log('getLastSupplyLog', data);
            var stockName = data.stock_name;

            //var findObj = {
            //    //product_id: data.product_id,
            //    product_code: data.product_code,
            //    supplier_code: data.supplier_code,
            //    //unit_price: data.unit_price
            //}
            var findObj = _.pick(data, ['product_code', 'supplier_code']);

            getStock(stockName, data.dpm).findLastOne(supplyLogTableName, findObj, { 'createingLog.createDate': -1 }, function (result) {
                cb(result);
            });
        },

        getLastSupplyLogAll: function (data, cb) {
            //console.log('getLastSupplyLog', data);
            var stockName = data.stock_name;

            //var findObj = {
            //    //product_id: data.product_id,
            //    product_code: data.product_code,
            //    supplier_code: data.supplier_code,
            //    //unit_price: data.unit_price
            //}

            getStock(stockName, data.dpm).findLastGroup(supplyLogTableName, {}, ['product_code', 'supplier_code'], 'createingLog.createDate', function (result) {
                cb(result);
            });
        },

        //getLastSupplyLogByCode: function (data, cb) {
        //    //console.log('getLastSupplyLog', data);
        //    var stockName = data.stock_name;

        //    var findObj = {
        //        code: data.code,
        //    }
        //    getStock(stockName).find(supplyLogTableName, findObj, function (result) {
        //        cb(result);
        //    });
        //},

        getAllSupplyLog: function (data, cb) {
            var stockName = data.stock_name;

            //console.log('getAllSupplyLog', data);

            getStock(stockName, data.dpm).getAll(supplyLogTableName, function (result) {

                if (cb) { cb(result) }
            });

        },

        //#endregion

        //#region ImportProduct
        insertImportProduct: function (data, cb) {
            var self = this;
            var stockName = data.stock_name;

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
            //console.log('insertImportProduct', data);

            var dataObj = _.pick(data, importProductDataField);

            dataObj.createingLog = { creator: data.user, 'createDate': new Date() };

            var stock = getStock(stockName, data.dpm);
            stock.insert(importProductTableName, dataObj, function (result) {

                var supplier_default = data.supplier_name;
                var unit_price_default = data.unit_price;

                stock.update(productTableName, { code: data.code }, { supplier_default: supplier_default, unit_price_default: unit_price_default }, function (result) {

                    self.updateProductUnitNumber(data, function () {
                        if (cb) { cb(result) }
                    });

                })

                //if (cb) { cb(result) }
            });
        },

        getImportProductInPeriod: function (data, cb) {

            var stockName = data.stock_name;
            //var timeStart = new Date(data.timeStart);
            //var timeEnd = new Date(data.timeEnd);

            var timeStart = data.timeStart;
            var timeEnd = data.timeEnd;

            var findObj = _.pick(data, [
                'code',
                'supplier_code',
                'invoid_id'
            ]);
            //console.log('getImportProductInPeriod', data);

            var stock = getStock(stockName, data.dpm);
            //stock.findInPeriod(importProductTableName, findObj, 'createingLog.createDate', timeStart, timeEnd, function (result) {
            //    if (cb) { cb(result) }
            //});

            stock.findInPeriod(importProductTableName, findObj, 'in_date', timeStart, timeEnd, function (result) {
                if (cb) { cb(result) }
            });
        },

        getImportProductInPeriodWithSearch: function (data, cb) {
            console.log('getImportProductInPeriodWithSearch', data);
            var stockName = data.stock_name;
            var timeStart = data.timeStart;
            var timeEnd = data.timeEnd;

            var findObj = _.pick(data, [
                'code',
                'supplier_code',
                'invoid_id'
            ]);
            //console.log('getImportProductInPeriod', data);

            var stock = getStock(stockName, data.dpm);
            //stock.findInPeriodStartWith(importProductTableName, findObj, 'createingLog.createDate', timeStart, timeEnd, function (result) {
            //    if (cb) { cb(result) }
            //});
            stock.findInPeriodStartWith(importProductTableName, findObj, 'in_date', timeStart, timeEnd, function (result) {
                if (cb) { cb(result) }
            });
        },
        getAllImportProduct: function (data, cb) {
            var stockName = data.stock_name;
            //console.log('getAllSupplier', data);
            var stock = getStock(stockName, data.dpm);
            stock.getAll(importProductTableName, function (result) {
                if (cb) { cb(result) }
            });

        },
        getLastImportProduct: function (data, cb) {
            var stockName = data.stock_name;
            var findObj = _.pick(data, ['code', 'supplier_code']);

            //getStock(stockName).findLastOne(importProductTableName, findObj, { 'createingLog.createDate': -1 }, function (result) {
            //    cb(result);
            //});
            var stock = getStock(stockName, data.dpm);
            stock.findLastOne(importProductTableName, findObj, { 'in_date': -1 }, function (result) {
                cb(result);
            });
        },
        removeImportProduct: function (data, cb) {
            //console.log('removeImportProduct',data);
            var self = this;
            var stockName = data.stock_name;
            var _id = data._id;

            var stock = getStock(stockName, data.dpm);
            stock.destroy(importProductTableName, { _id: _id }, function (result) {

                self.updateProductUnitNumber(data, function () {
                    if (cb) { cb(result) }
                });
            })
        },
        updateImportProduct: function (data, cb) {
            var self = this;
            var stockName = data.stock_name;
            var _id = data._id;

            //var dataObj = _.pick(data, [
            //   'supplier_code',
            //   'unit_price',
            //   'unit',
            //   'in_date',
            //   'invoid_id',
            //   'sum'
            //   //'stock_name'
            //]);

            var dataObj = _.pick(data, importProductDataField);

            dataObj['createingLog.updater'] = data.user;
            dataObj['createingLog.updateDate'] = new Date();

            console.log('updateImportProduct', dataObj);

            var stock = getStock(stockName, data.dpm);
            stock.update(importProductTableName, { _id: _id }, dataObj, function (result) {

                self.updateProductUnitNumber(data, function () {
                    if (cb) { cb(result) }
                });
            })
        },

        checkDuplicateImportProduct: function (data, cb) {
            console.log('checkDuplicateImportProduct', data);
            var stockName = data.stock_name;
            var code = data.code;
            var invoid_id = data.invoid_id;
            //var insertObj = _.pick(data, productDataField);
            //insertObj.createingLog = { creator: 'admin', 'createDate': new Date() };

            var stock = getStock(stockName, data.dpm);
            stock.findOne(importProductTableName, { code: code, invoid_id: invoid_id }, function (result) {
                var isDuplicate = result ? true : false;
                console.log('isDuplicate', stockName, isDuplicate, result);
                if (cb) { cb(isDuplicate) }
            });
        },
        //#endregion

        //#region ExportProduct
        insertExportProduct: function (data, cb) {
            console.log('insertExportProduct', data);
            var self = this;
            var stockName = data.stock_name;

            var dataObj = _.pick(data, exportProductDataField);

            dataObj.createingLog = { creator: data.user, 'createDate': new Date() };

            var stock = getStock(stockName, data.dpm);
            stock.insert(exportProductTableName, dataObj, function (result) {

                self.updateProductUnitNumber(data, function () {
                    if (cb) { cb(result) }
                });
            })
        },
        getAllExportProduct: function (data, cb) {
            var stockName = data.stock_name;
            //console.log('getAllSupplier', data);
            var stock = getStock(stockName, data.dpm);
            stock.getAll(exportProductTableName, function (result) {

                if (cb) { cb(result) }
            });

        },
        getExportProductInPeriod: function (data, cb) {

            var stockName = data.stock_name;
            //var timeStart = new Date(data.timeStart);
            //var timeEnd = new Date(data.timeEnd);

            var timeStart = data.timeStart;
            var timeEnd = data.timeEnd;

            var findObj = _.pick(data, [
                'code',
            ]);
            //console.log('getImportProductInPeriod', data);

            var stock = getStock(stockName, data.dpm);
            //stock.findInPeriod(exportProductTableName, findObj, 'createingLog.createDate', timeStart, timeEnd, function (result) {
            //    if (cb) { cb(result) }
            //});
            stock.findInPeriod(exportProductTableName, findObj, 'out_date', timeStart, timeEnd, function (result) {
                if (cb) { cb(result) }
            });
        },
        getExportProductInPeriodWithSearch: function (data, cb) {
            console.log('getExportProductInPeriodWithSearch', data);
            var stockName = data.stock_name;

            var timeStart = data.timeStart;
            var timeEnd = data.timeEnd;

            var findObj = _.pick(data, [
                'code',
                'requisition_id',
                'job'
            ]);
            //console.log('getImportProductInPeriod', data);

            var stock = getStock(stockName, data.dpm);
            stock.findInPeriodStartWith(exportProductTableName, findObj, 'out_date', timeStart, timeEnd, function (result) {
                if (cb) { cb(result) }
            });
        },
        removeExportProduct: function (data, cb) {
            var self = this;
            //console.log('removeImportProduct',data);
            var stockName = data.stock_name;
            var _id = data._id;

            var stock = getStock(stockName, data.dpm);
            stock.destroy(exportProductTableName, { _id: _id }, function (result) {

                self.updateProductUnitNumber(data, function () {
                    if (cb) { cb(result) }
                });
            })
        },
        updateExportProduct: function (data, cb) {
            var self = this;
            var stockName = data.stock_name;
            var _id = data._id;

            var dataObj = _.pick(data, exportProductDataField);
            dataObj['createingLog.updater'] = data.user;
            dataObj['createingLog.updateDate'] = new Date();

            var stock = getStock(stockName, data.dpm);
            stock.update(exportProductTableName, { _id: _id }, dataObj, function (result) {

                self.updateProductUnitNumber(data, function () {
                    if (cb) { cb(result) }
                });
            });
        },

        checkDuplicateExportProduct: function (data, cb) {
            var stockName = data.stock_name;
            var code = data.code;
            var requisition_id = data.requisition_id;
            //var insertObj = _.pick(data, productDataField);
            //insertObj.createingLog = { creator: 'admin', 'createDate': new Date() };


            var stock = getStock(stockName, data.dpm);
            stock.findOne(exportProductTableName, { code: code, requisition_id: requisition_id }, function (result) {
                var isDuplicate = result ? true : false;
                if (cb) { cb(isDuplicate) }
            });
        },
        //#endregion

        //#region CheckProduct
        insertCheckProduct: function (data, cb) {
            var self = this;
            var stockName = data.stock_name;

            var dataObj = _.pick(data, checkProductDataField);

            console.log(dataObj);

            dataObj.createingLog = { creator: data.user, 'createDate': new Date() };

            var stock = getStock(stockName, data.dpm);
            stock.update(checkProductTableName, { code: data.code, check_date: data.check_date }, dataObj, function (result) {
                if (cb) { cb(result) }
            });
        },
        getCheckProductDate: function (data, cb) {
            var self = this;
            var stockName = data.stock_name;

            var stock = getStock(stockName, data.dpm);
            stock.getAll(checkProductTableName, function (docs) {
                //console.log(docs.length);
                var result = _.chain(docs).groupBy(function (doc) {
                    return doc.check_date;
                }).keys().value();

                if (cb) { cb(result) }
            });
        },
        getCheckProduct: function (data, cb) {
            var self = this;
            var stockName = data.stock_name;

            var dataObj = _.pick(data, ['check_date', 'code']);
            if (data.codes) {
                dataObj.code = { $in: data.codes };
            }

            console.log(dataObj);

            var stock = getStock(stockName, data.dpm);

            stock.find(checkProductTableName, dataObj, function (result) {
                if (cb) { cb(result) }
            });
        },
        editCheckProductDate: function (data, cb) {

            console.log('editCheckProductDate', data);
            var self = this;
            var stock_name = data.stock_name;
            var check_date = data.check_date;
            var check_dateEdit = data.check_dateEdit;

            var dataObj = { check_date: check_dateEdit };

            //var dataObj = _.pick(data, checkProductDataField);
            //console.log(dataObj);

            dataObj.createingLog = { creator: data.user, 'createDate': new Date() };

            var stock = getStock(stock_name, data.dpm);
            stock.updateAll(checkProductTableName, { check_date: check_date }, dataObj, function (result) {
                if (cb) { cb(result) }
            });
        },
        deleteCheckProducts: function (data, cb) {
            console.log('deleteCheckProducts', data);
            var self = this;
            var stock_name = data.stock_name;
            var check_date = data.check_date;

            var stock = getStock(stock_name, data.dpm);

            stock.destroy(checkProductTableName, { check_date: check_date }, function (result) {
                if (cb) { cb(result) }
            })
        },
        //#endregion

        //#region Supplier
        getAllSupplier: function (data, cb) {

            //console.log('getAllSupplier', data);

            var stock = getStock('globalDB', data.dpm);

            stock.getAll(importSupplierTableName, function (result) {

                if (cb) { cb(result) }
            });

        },
        findeSupplierStartWith: function (data, cb) {

            var findWord = data.findWord;
            var limit = data.limit ? data.limit : 20;
            //var stock = new NwDbConnection(__dirname + '/../Database/stock/stock1.s3db'); //getStock(stockName,data.dpm);
            var stock = getStock('globalDB', data.dpm);
            stock.findStartWith(importSupplierTableName, { code: findWord, name: findWord }, limit, function (result) {

                if (cb) { cb(result) }
            });
        },
        insertSupplier: function (data, cb) {

            var dataObj = _.pick(data, supplierDataField);

            dataObj.createingLog = { creator: data.user, 'createDate': new Date() };

            var stock = getStock('globalDB', data.dpm);
            stock.insert(importSupplierTableName, dataObj, function (result) {

                if (cb) { cb(result) }
            });
        },
        updateSupplier: function (data, cb) {
            //console.log('updateSupplier', data);

            var dataObj = _.pick(data, supplierDataField);
            //dataObj.createingLog = { updater: 'admin', updateDate: new Date() };
            dataObj['createingLog.updater'] = data.user
            dataObj['createingLog.updateDate'] = new Date();

            var stock = getStock('globalDB', data.dpm);
            stock.update(importSupplierTableName, { code: data.code }, dataObj, function (result) {
                if (cb) { cb(result) }
            });
        },
        deleteSupplier: function (data, cb) {
            var code = data.code;

            var stock = getStock('globalDB', data.dpm);
            stock.destroy(importSupplierTableName, { code: code }, function (result) {
                if (cb) { cb(result) }
            })
        },

        checkDuplicateSupplier: function (data, cb) {
            console.log('checkDuplicateSupplier', data);
            //var stockName = data.stock_name;
            var code = data.code;
            var name = data.name;
            //var insertObj = _.pick(data, productDataField);
            //insertObj.createingLog = { creator: 'admin', 'createDate': new Date() };

            var findObj = { $or: [{ code: code }, { name: name }] };

            var stock = getStock('globalDB', data.dpm);
            stock.findOne(importSupplierTableName, findObj, function (result) {
                var isDuplicate = result ? true : false;
                if (cb) { cb(isDuplicate) }
            });
        }
        //#endregion
    };

    if (typeof module !== "undefined" && module.exports) {                       // NodeJS/CommonJS
        module.exports = NwStockServiceMethod;
    } else {

        context.NwStockServiceMethod = NwStockServiceMethod;
    }

})(this);