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
    $('#PersonTableContainer').jtable({
        title: 'Table of Users',
        actions: {
            listAction: function (postData, jtParams) {
                console.log("Loading from custom function...");
                return $.Deferred(function ($dfd) {
                    console.log('url', jtParams.jtStartIndex + '&jtPageSize=' + jtParams.jtPageSize + '&jtSorting=' + jtParams.jtSorting);

                    app.serviceMethod.call('getHosportState', {}, function (result) {

                        $dfd.resolve({
                            "Result": "OK",
                            "Records": result
                        });
                    });

                    // $.ajax({
                    //     url: '/Demo/StudentList?jtStartIndex=' + jtParams.jtStartIndex + '&jtPageSize=' + jtParams.jtPageSize + '&jtSorting=' + jtParams.jtSorting,
                    //     type: 'POST',
                    //     dataType: 'json',
                    //     data: postData,
                    //     success: function (data) {
                    //         $dfd.resolve(data);
                    //     },
                    //     error: function () {
                    //         $dfd.reject();
                    //     }
                    // });
                });
            },
            // createAction: '/GettingStarted/CreatePerson',
            updateAction: function (postData) {
                console.log("updating from custom function...");
                return $.Deferred(function ($dfd) {
                    var postDataObj = getJsonFromUrl(postData);
                    console.log('postData', postData,postDataObj);

                    app.serviceMethod.call('updateUser', postDataObj, function (result) {
                        if (result) {
                            $dfd.resolve({ "Result": "OK" });
                        } else {
                            $dfd.reject();
                        }

                    });
                    //
                    // $.ajax({
                    //     url: '/Demo/UpdateStudent',
                    //     type: 'POST',
                    //     dataType: 'json',
                    //     data: postData,
                    //     success: function (data) {
                    //         $dfd.resolve(data);
                    //     },
                    //     error: function () {
                    //         $dfd.reject();
                    //     }
                    // });
                });
            },
            deleteAction: function (postData) {
                console.log("deleting from custom function...");
                return $.Deferred(function ($dfd) {
                    console.log('postData', postData);
                    app.serviceMethod.call('deleteUser', postData, function (result) {
                        if (result) {
                            $dfd.resolve({ "Result": "OK" });
                        } else {
                            $dfd.reject();
                        }
                    });
                    //$dfd.reject();
                    // $.ajax({
                    //     url: '/Demo/DeleteStudent',
                    //     type: 'POST',
                    //     dataType: 'json',
                    //     data: postData,
                    //     success: function (data) {
                    //         $dfd.resolve(data);
                    //     },
                    //     error: function () {
                    //         $dfd.reject();
                    //     }
                    // });
                });
            },
        },
        fields: {

            name: {
                key: true,
                title: 'User Name',
                create: false,
                edit: false
            },
            remark: {
                title: 'Remark',
            },
            startDate: {
                title: 'Check In',
                type: 'date',
                edit: false
            },
            endDate: {
                title: 'Check Out',
                type: 'date',
            },

            address: {
                title: 'IP Address',
                create: false,
                edit: false
            },
            'mac-address': {
                title: 'Mac Address',
                create: false,
                edit: false
            },

            kickOut: {
                width: '1%',
                create: false,
                edit: false,
                display: function (data) {
                    if (data.record && data.record.isActive) {
                        // return '<button title="Block this mac address." class="kickoutButton" data-value="' + data.record.name + '" style="width: 100%">KickOut</button>' +
                        //     '<button title="Block this mac address." class="blockButton" data-value="' + data.record.name + '" style="width: 100%">Block</button>';
                        return '<button title="Kick this current user." data-value="' + data.record.name + '" class="kickoutButton" >KickOut</button>';
                        //'<button title="Block this mac address." data-value="' + data.record.name + '" class="blockButton" >Block</button>';
                    } else {
                        return '';
                    }


                }
            },
            blockmac: {
                width: '1%',
                create: false,
                edit: false,
                display: function (data) {
                    if (data.record && data.record.isActive) {
                        // return '<button title="Block this mac address." class="kickoutButton" data-value="' + data.record.name + '" style="width: 100%">KickOut</button>' +
                        //     '<button title="Block this mac address." class="blockButton" data-value="' + data.record.name + '" style="width: 100%">Block</button>';
                        // '<button title="Kick this current user." data-value="' + data.record.name + '" class="kickoutButton" >KickOut</button>';
                        return '<button title="Block this mac address." data-value="' + data.record.name + '" class="blockButton" >Block</button>';
                    } else {
                        return '';
                    }


                }
            },
            isActive: {
                title: 'State',
                width: '1%',
                create: false,
                edit: false,
                display: function (data) {

                    if (data.record && data.record.isActive) {
                        return '<b style=" background-color: lightgreen  ; width: 100%" >online</b>';
                    } else {
                        return '<b style=" background-color: red  ; width: 100%" >offline</b>';
                    }

                }
            },

        }
    });

    $('#PersonTableContainer').on('click', '.blockButton', function () {

        alert("Don't implement, yet. \nuser: " + $(this).attr('data-value'))
    });

    $('#PersonTableContainer').on('click', '.kickoutButton', function (ev) {

        app.serviceMethod.call('kickUser', { name: $(this).attr('data-value') }, function (result) {

        });

    });

    $('#nameSearch').keyup(function () {
        console.log($('#nameSearch').val());
    });

    $('#PersonTableContainer').jtable('load');

    app.serviceMethod.regEvent('updateHosportState', function (result) {
        console.log('updateHosportState ev', result);
        var sid = app.serviceMethod.getSocketId();
        if (sid != result.sid) {
            $('#PersonTableContainer').jtable('load');
        }
    });
});