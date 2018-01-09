/// <reference path="VsLib.js" />


//try {
//    var jsface = require("./jsface/jsface.js"),
//        Class = jsface.Class,
//        extend = jsface.extend;
//} catch (e) {

//}

//(function () {


var Person0 = function (name, age) {
    var _name = '';
    var _age = 0;

    if (name) {
        _name = this._name = name;
    }
    if (age != undefined) {
        _age = this._age = age;
    }

    var sayHello = this.sayHello = function () {
        return 'hello, I am ' + _name;
    }

    var toString = this.toString = function () {

        return getStr();

    }
    var getStr = this.getStr = function () {
        return _name + "/" + _age;
    }

    // get set method//
    this.getName = function () {
        return _name;
    }
    this.setName = function (name) {
        _name = this._name = name;
    }
    this.getAge = function () {
        return _age;
    }
    this.setAge = function (age) {
        _age = this._age = age;
    }

}

var JsonSerializable = Class(function () {

    function getClass(obj) {
        if (typeof obj === "undefined")
            return "undefined";
        if (obj === null)
            return "null";
        return Object.prototype.toString.call(obj)
          .match(/^\[object\s(.*)\]$/)[1];
    }

    return {
        //$statics: {

        //},
        formJsonObj: function (obj) {
            for (var prop in obj) this[prop] = obj[prop];
        },
        formJsonStr: function (jsonStr) {
            var obj = JSON.parse(jsonStr)
            this.formJsonObj(obj);
        },
        toJsonStr: function () {
            return JSON.stringify(this)
        },
        getClass: function () {
            return getClass(this);
        }
    }
});

var Person = Class(JsonSerializable, {

    _name: '',
    _age: 0,

    constructor: function (name, age) {
        if (name) {
            this._name = name;
        }
        if (age != undefined) {
            this._age = age;
        }

        this._name = name;
        this._age = age;
    },
    sayHello: function () {
        return 'hello, I am ' + this._name;
    },

    toString: function () {
        return this.getStr();
    },
    getStr: function () {
        return this._name + "/" + this._age;
    },

    // get set method//
    getName: function () {
        return this._name;
    },
    setName: function (name) {
        this._name = name;
        return this;
    },
    getAge: function () {
        return this._age;
    },
    setAge: function (age) {
        this._age = age;
        return this;
    }
});

var StudenPropery = Class({
    _name: '',

    stdId: this.stdId ? this.stdId : 'no id',
    constructor: function () {

        console.log('StudenPropery construct');
        if (arguments.length = 0) {
            this.stdId = 'no id';
        } else {
            this.stdId = arguments[0];
        }
    },

    //self:null,
    toString: function () {
        return this.stdId;//+ "/" + self.toString.call(this); // Invoke parent's toString method
        // return this.id + "/" + this.$super();                    // This api is removed since v2.1.0
    },

    study: function () {
        return this._name + ': study study study...zzz';
    },

    sayHello: function () {
        return 'hello, I am studen ' + this.stdId;
    }
});

var Studen = Class([Person, StudenPropery], {

    constructor: function (stdId, name, age) {

        Studen.$super[0].call(this, name, age);
        Studen.$super[1].call(this, stdId);// Invoke parent's constructor
        // this.$super(name, age);                   // This api is removed since v2.1.0
    },

    //getStr: function () {
    //    return this.id + "/" + Studen.$superp.getStr.call(this); // Invoke parent's toString method
    //    // return this.id + "/" + this.$super();                    // This api is removed since v2.1.0
    //}
});


function testClass() {

    var rika = new Person("Rika", 12);

    var kana = new Person("kana", 20);

    var newww = new Person();
    newww.setAge(27).setName('newww');

    console.log('hay rika :' + rika.sayHello());
    console.log('hay kana :' + kana.sayHello());
    console.log('hay newww :' + newww.sayHello());

    console.log(rika instanceof Person);

    console.log(rika.getClass());
    console.log('rika==kana ? ' + (rika == kana));
    console.log('rika===kana ? ' + (rika === kana));

    console.log('');

    var studen = new Studen(426, 'newww', 27);

    console.log('hay studen :' + studen.sayHello() + " " + studen.study());

    //jsface.extend(Person, StudenPropery);
    console.log('Nwjsface.extend(kana, StudenPropery);');
    Nwjsface.extend(kana, StudenPropery);
    //kana.stdId = 123;

    console.log('hay rika :' + rika.sayHello());
    console.log('hay kana :' + kana.sayHello());

    console.log('');
    try {
        console.log(rika.study());
    } catch (e) {
        console.log(e);
    }

    try {
        console.log(kana.study());
    } catch (e) {
        console.log(e);
    }

    console.log('');
    var rikaJsonStr = rika.toJsonStr();

    var rikaClone = new Person();
    rikaClone.formJsonStr(rikaJsonStr);

    console.log('rika.toJsonStr ' + rika.toJsonStr());
    console.log('rikaClone.toJsonStr ' + rikaClone.toJsonStr());

    console.log('');
    console.log('');
    console.log('//test diferent betwen this. and protype');
    var testClass = function () {
        this._name = 'newww';
        //this._age = 26;

        this.showAge = function () {
            return this.age;
        }
        this.setAge = function (age) {
            this.age = age;
        }
    }

    testClass.prototype.age = 27;

    var tc = new testClass();
    var tc2 = new testClass();


    console.log(JSON.stringify(tc));
    console.log(tc.showAge() + ' ' + tc2.showAge());

    tc.setAge(29);
    testClass.prototype.age = 28;

    console.log(JSON.stringify(tc));
    console.log(tc.showAge() + ' ' + tc2.showAge());
    console.log('');

    //for(var key in tc)
    //{
    //    console.log(tc[key]);
    //}


    //var theOne = Class(Person, {
    //    $singleton: true,
    //    name: "one",
    //    age: 1

    //});


    //alert('std is ' + theOne.getStr());


    //console.log('std is '+std);
}



//})();
