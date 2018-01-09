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
                        // _.each(result, (item) => {
                        //     item['first-on'] = app.time.removeTimezoneOffset(new Date(item['first-on'])).toISOString().slice(0, 19).replace('T', ' ');
                        //     item['last-on'] = app.time.removeTimezoneOffset(new Date(item['last-on'])).toISOString().slice(0, 19).replace('T', ' ');

                        // });

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
            'name': {
                title: 'name',
            },
            // address: {
            //     title: 'IP Address',
            //     create: false,
            //     edit: false
            // },
            'num': {
                title: 'time use (hr)',
                //type: 'date',
                edit: false
            },
            'period': {
                title: 'period use (day)',
                //type: 'date',
                edit: false
            },
            detail: {
                width: '1%',
                create: false,
                edit: false,
                display: function (data) {
                    //if (data.record && data.record.isActive) {
                    // return '<button title="Block this mac address." class="kickoutButton" data-value="' + data.record.name + '" style="width: 100%">KickOut</button>' +
                    //     '<button title="Block this mac address." class="blockButton" data-value="' + data.record.name + '" style="width: 100%">Block</button>';
                    // '<button title="Kick this current user." data-value="' + data.record.name + '" class="kickoutButton" >KickOut</button>';
                    return '<button title="Block this mac address." data-value="' + data.record.mac + '" class="detailButton" >Detail</button>';
                    // } else {
                    //     return '';
                    // }
                }
            },
            block: {
                width: '1%',
                create: false,
                edit: false,
                display: function (data) {
                    // if (data.record && data.record.isActive) {
                    // return '<button title="Block this mac address." class="kickoutButton" data-value="' + data.record.name + '" style="width: 100%">KickOut</button>' +
                    //     '<button title="Block this mac address." class="blockButton" data-value="' + data.record.name + '" style="width: 100%">Block</button>';
                    return '<button title="Kick this current user." data-value="' + data.record.mac + '" class="BlockButton" >Block</button>';
                    //'<button title="Block this mac address." data-value="' + data.record.name + '" class="blockButton" >Block</button>';
                    // } else {
                    //     return '';
                    // }


                }
            },

            unblock: {
                width: '1%',
                create: false,
                edit: false,
                display: function (data) {
                    //if (data.record && data.record.isActive) {
                    // return '<button title="Block this mac address." class="kickoutButton" data-value="' + data.record.name + '" style="width: 100%">KickOut</button>' +
                    //     '<button title="Block this mac address." class="blockButton" data-value="' + data.record.name + '" style="width: 100%">Block</button>';
                    // '<button title="Kick this current user." data-value="' + data.record.name + '" class="kickoutButton" >KickOut</button>';
                    return '<button title="Block this mac address." data-value="' + data.record.mac + '" class="blockButton" >Unblock</button>';
                    // } else {
                    //     return '';
                    // }
                }
            },
            isActive: {
                title: 'State',
                width: '1%',
                create: false,
                edit: false,
                display: function (data) {

                    if (data.record && data.record.isBlock) {
                        return '<b style=" background-color: red  ; width: 100%" >Block</b>';
                    } else {
                        return '<b style=" background-color: lightgreen  ; width: 100%" >nonBlock</b>';
                    }

                }
            },
        }
    });


    $('#PersonTableContainer').on('click', '.BlockButton', function (ev) {

        alert($(this).attr('data-value'));
    });


    function loadDetail(mac) {
        var myWindow = window.open("chart.html#" + mac, 'chart_' + mac, 'width=' + 800 + ',height=' + 500 + '');

    }


    $('#PersonTableContainer').on('click', '.detailButton', function (ev) {
        var mac = $(this).attr('data-value')
        loadDetail(mac)
        // alert();
    });


    //$('#PersonTableContainer').jtable('load');

    var currentData = null;
    function upatePeriodCheck() {
        var periodCheck = parseInt($('#periodCheck').val());
        app.serviceMethod.call('getPotentialLocal', { periodFilter: periodCheck }, function (result) {
            console.log(result);
            result = _.map(result, function (item) {
                item.num = app.math.precision(item.num, 2);
                item.period = app.math.precision(item.period, 2);
                return item;
            })
            currentData = result;
            //var sid = app.serviceMethod.getSocketId();
            //if (sid != result.sid) {
            $('.jtable-title-text').text(tableName + ': ' + new Date() + ' (' + result.length + ')');
            $('#PersonTableContainer').jtable('load');
            //}

            console.log(result);
        })
    }
    upatePeriodCheck();
    $('#periodCheckButton').click(function () {
        upatePeriodCheck();
    });
    // app.serviceMethod.regEvent('updateServerState', function (result) {
    //     console.log('updateServerState ev', result);
    //     currentData = result;
    //     var sid = app.serviceMethod.getSocketId();
    //     if (sid != result.sid) {
    //         $('.jtable-title-text').text(tableName + ': ' + new Date() + ' (' + result.length + ')');
    //         $('#PersonTableContainer').jtable('load');
    //     }
    // });
});