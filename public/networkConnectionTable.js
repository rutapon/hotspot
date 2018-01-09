/// <reference path="NwLib/NwLib.js" />
/// <reference path="lib/jquery/jquery-2.1.1.js" />

var app = app || { models: {}, collections: {}, views: {} };

$(function () {

    function getJsonFromUrl(query) {

        var result = {};
        query.split("&").forEach(function (part) {
            var item = part.split("=");
            result[item[0]] = decodeURIComponent(item[1]);
        });
        return result;
    }

    var dataTest = {
        "Result": "OK",
        "Records": [
            {
                "name": 1, remark: 'test', "inDate": "2011-11-05", "outDate": "2011-11-05"
            },
            {
                "name": 2, remark: 'test', "inDate": "2011-11-05", "outDate": "2011-11-05"
            },
        ]
    }
    var tableName = 'Table of Current Network Client';
    $('#PersonTableContainer').jtable({
        title: tableName,
        sorting: true, //Enable sorting
        defaultSorting: 'first-on ASC', //Set default sorting
        actions: {
            listAction: function (postData, jtParams) {
                console.log("Loading from custom function...");
                return $.Deferred(function ($dfd) {
                    console.log('url', jtParams);

                    var result = currentData ? currentData : [];
                    if (result) {

                        if (jtParams.jtSorting) {
                            var sortField = jtParams.jtSorting.split(' ')[0];
                            var sortType = jtParams.jtSorting.split(' ')[1];

                            result = _.sortBy(result, sortField);
                            if (sortType == 'DESC') {
                                result = result.reverse();
                            }
                        }
                        _.each(result, (item) => {
                            item['first-on'] = app.time.removeTimezoneOffset(new Date(item['first-on'])).toISOString().slice(0, 19).replace('T', ' ');
                            item['last-on'] = app.time.removeTimezoneOffset(new Date(item['last-on'])).toISOString().slice(0, 19).replace('T', ' ');

                        });

                    }

                    $dfd.resolve({
                        "Result": "OK",
                        "Records": result
                    });
                });
            },
            // createAction: '/GettingStarted/CreatePerson',

        },
        fields: {

            mac: {
                key: true,
                title: 'Mac Address',
                create: false,
                edit: false
            },
            'host-name': {
                title: 'name',
            },
            address: {
                title: 'IP Address',
                create: false,
                edit: false
            },
            'first-on': {
                title: 'first On',
                //type: 'date',
                edit: false
            },
            'last-on': {
                title: 'last On',
                //type: 'date',
                edit: false
            },
        }
    });


    $('#nameSearch').keyup(function () {
        console.log($('#nameSearch').val());
    });

    //$('#PersonTableContainer').jtable('load');

    var currentData = null;
    app.serviceMethod.regEvent('updateServerState', function (result) {
        console.log('updateServerState ev', result);
        currentData = result;
        var sid = app.serviceMethod.getSocketId();
        if (sid != result.sid) {
            $('.jtable-title-text').text(tableName + ': ' + new Date() + ' (' + result.length + ')');
            $('#PersonTableContainer').jtable('load');
        }
    });
});