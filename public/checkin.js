
$(function () {
    $('#endTime').datebox({
        mode: "calbox",
        useFocus: true,
        defaultValue: app.time.addDays(new Date(), 1),
        showInitialValue: true,
        afterToday: true,
        closeCallback: function (arg) {
            //console.log('closeCallback', arg);
            // if (!arg.cancelClose) {
            //     var $selecttimetype =$("select.select-time-type");

            //     if ($selecttimetype.val() != 'custom') {
            //         $selecttimetype.val('custom');
            //         $selecttimetype.trigger("change");
            //         self.render();
            //     }
            // }
        }
    });

    if (localStorage && localStorage.getItem("lastNextUserName")) {
        $('#user').val(localStorage.getItem("lastNextUserName"));
    }

    function getPrefix(str) {
        var i = 0;
        for (var key in str) {
            var element = str[key];

            if (!isNaN(parseInt(element))) {
                i = key;
                break;
            }
        }

        if (i > 0 && i < str.length - 1) {
            return str.substr(0, i)
        } else {
            return '';
        }
    }
    var formatInt = function (intNum) {
        if (intNum > 9999) {
            return intNum;
        } else {
            let formattedNumber = ("000" + intNum).slice(-4);
            return formattedNumber;
        }
    }
    $('#Submit').click(function () {
        var username = $('#user').val();
        var roomNumber = $('#roomNumber').val();
        var endTime = $('#endTime').val();
        var startDate = app.time.removeTimezoneOffset(new Date()).toISOString().slice(0, 10);

        if (username && username.length > 3 && roomNumber) {
            var confirmResult = confirm('Username: ' + username + '\nRoom Number: ' + roomNumber +
                '\nCheck-In:' + startDate + '\nCheck-Out: ' + endTime)
            if (confirmResult) {
                let password = getPassword(username);
                app.serviceMethod.insertUser({ name: username, password: password, remark: roomNumber, startDate: startDate, endDate: endTime },
                    function (result) {
                        if (result && !_.isString(result)) {
                            let prefix = getPrefix(username)
                            let intUser = parseInt(username.replace(prefix, ''))
                            if (!isNaN(parseInt(intUser))) {
                                let newUerName = prefix + formatInt(intUser + 1);
                                console.log('newUerName', newUerName);
                                $('#user').val(newUerName);
                                localStorage.setItem("lastNextUserName", newUerName);
                            } else {
                                $('#user').val('');
                            }
                            $('#roomNumber').val('');
                            $('#endTime').val(app.time.removeTimezoneOffset(new Date()).toISOString().slice(0, 10));
                        } else {
                            alert("Can't sumbmit user.\n" + result)
                        }
                    });


            }
        }

    })

})

