var formatInt = function (intNum) {
    if (intNum > 9999) {
        return intNum;
    } else {
        let formattedNumber = ("000" + intNum).slice(-4);
        return formattedNumber;
    }
}

var createPasswordList = function (prefix, numStart, numEnd) {
    var dataObjArray = [];//_.pluck(stooges, ['code', 'name']);
    var data = []


    for (var index = numStart; index <= numEnd; index++) {
        let userName = prefix + formatInt(index);
        data.push({ user: userName, pass: getPassword(userName) });
    }

    var saveObjKeyPare = {
        user: 'username',
        pass: 'password',
    };

    _.each(data, function (dataObj) {
        let savaDataObj = {};

        for (var key in saveObjKeyPare) {
            savaDataObj[saveObjKeyPare[key]] = dataObj[key];
        }

        dataObjArray.push(savaDataObj);
    })

    return dataObjArray;
};
var mirrorDataObjArray = function (dataObjArray) {
    var gropNum = 3
    var count = 0;
    var gropArray = [];
    var mirrorGropArray = [];

    _.each(dataObjArray, function (item, key) {
        count++;
        //console.log(count, item);
        gropArray.push(item);
        if (count % gropNum == 0) {
            //console.log(gropArray);
            mirrorGropArray.push(gropArray.reverse());
            gropArray = [];
        }
    });

    return _.flatten(mirrorGropArray, true);

}
$(function () {

    $('#user').keyup(function () {
        var userName = $('#user').val();

        var passWord = userName.length > 3 ? getPassword(userName) : '';
        $('#password').val(passWord);


    });
    $('#Submit').click(function () {
        let prefix = 'a';
        let numStart = 1;
        let numEnd = 3000;

        var dataObjArray = createPasswordList(prefix, numStart, numEnd);

        SaveXlsx(dataObjArray, 'data', 'user_pass_data');
    })
    $('#downloadBackward').click(function () {
        let prefix = 'a';
        let numStart = 1;
        let numEnd = 3000;

        var dataObjArray = createPasswordList(prefix, numStart, numEnd);

        dataObjArray = mirrorDataObjArray(dataObjArray);
        //console.log(dataObjArray);
        SaveXlsx(dataObjArray, 'data', 'user_pass_data_mirror');
    })
})