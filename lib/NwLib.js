//NeLib 
//comprise with 

//# checking for window.console
//# checking for JSON object
//# Nwjsface lib 
//# helper class
//# Nw lib 

//for defend bomb out in IE when the IE debugger is not running
if (this.window && !window.console) window.console = {};
if (this.window && !window.console.log) window.console.log = function () { };
if (!this.require) this.require = function (script) { Nw.inject_module(script); }
//########################################################################################################

/*
 json2.js
    2012-10-08
    Public Domain.
    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
    See http://www.JSON.org/js.html
    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html
*/

///newww: check for none original JSON in browser
if (!this.JSON) {
    if (typeof JSON !== 'object') {
        JSON = {};
    }

    (function () {
        'use strict';

        function f(n) {
            // Format integers to have at least two digits.
            return n < 10 ? '0' + n : n;
        }

        if (typeof Date.prototype.toJSON !== 'function') {

            Date.prototype.toJSON = function (key) {

                return isFinite(this.valueOf())
                    ? this.getUTCFullYear() + '-' +
                        f(this.getUTCMonth() + 1) + '-' +
                        f(this.getUTCDate()) + 'T' +
                        f(this.getUTCHours()) + ':' +
                        f(this.getUTCMinutes()) + ':' +
                        f(this.getUTCSeconds()) + 'Z'
                    : null;
            };

            String.prototype.toJSON =
                Number.prototype.toJSON =
                Boolean.prototype.toJSON = function (key) {
                    return this.valueOf();
                };
        }

        var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
            escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
            gap,
            indent,
            meta = {    // table of character substitutions
                '\b': '\\b',
                '\t': '\\t',
                '\n': '\\n',
                '\f': '\\f',
                '\r': '\\r',
                '"': '\\"',
                '\\': '\\\\'
            },
            rep;


        function quote(string) {

            // If the string contains no control characters, no quote characters, and no
            // backslash characters, then we can safely slap some quotes around it.
            // Otherwise we must also replace the offending characters with safe escape
            // sequences.

            escapable.lastIndex = 0;
            return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
                var c = meta[a];
                return typeof c === 'string'
                    ? c
                    : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' : '"' + string + '"';
        }


        function str(key, holder) {

            // Produce a string from holder[key].

            var i,          // The loop counter.
                k,          // The member key.
                v,          // The member value.
                length,
                mind = gap,
                partial,
                value = holder[key];

            // If the value has a toJSON method, call it to obtain a replacement value.

            if (value && typeof value === 'object' &&
                    typeof value.toJSON === 'function') {
                value = value.toJSON(key);
            }

            // If we were called with a replacer function, then call the replacer to
            // obtain a replacement value.

            if (typeof rep === 'function') {
                value = rep.call(holder, key, value);
            }

            // What happens next depends on the value's type.

            switch (typeof value) {
                case 'string':
                    return quote(value);

                case 'number':

                    // JSON numbers must be finite. Encode non-finite numbers as null.

                    return isFinite(value) ? String(value) : 'null';

                case 'boolean':
                case 'null':

                    // If the value is a boolean or null, convert it to a string. Note:
                    // typeof null does not produce 'null'. The case is included here in
                    // the remote chance that this gets fixed someday.

                    return String(value);

                    // If the type is 'object', we might be dealing with an object or an array or
                    // null.

                case 'object':

                    // Due to a specification blunder in ECMAScript, typeof null is 'object',
                    // so watch out for that case.

                    if (!value) {
                        return 'null';
                    }

                    // Make an array to hold the partial results of stringifying this object value.

                    gap += indent;
                    partial = [];

                    // Is the value an array?

                    if (Object.prototype.toString.apply(value) === '[object Array]') {

                        // The value is an array. Stringify every element. Use null as a placeholder
                        // for non-JSON values.

                        length = value.length;
                        for (i = 0; i < length; i += 1) {
                            partial[i] = str(i, value) || 'null';
                        }

                        // Join all of the elements together, separated with commas, and wrap them in
                        // brackets.

                        v = partial.length === 0
                            ? '[]'
                            : gap
                            ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                            : '[' + partial.join(',') + ']';
                        gap = mind;
                        return v;
                    }

                    // If the replacer is an array, use it to select the members to be stringified.

                    if (rep && typeof rep === 'object') {
                        length = rep.length;
                        for (i = 0; i < length; i += 1) {
                            if (typeof rep[i] === 'string') {
                                k = rep[i];
                                v = str(k, value);
                                if (v) {
                                    partial.push(quote(k) + (gap ? ': ' : ':') + v);
                                }
                            }
                        }
                    } else {

                        // Otherwise, iterate through all of the keys in the object.

                        for (k in value) {
                            if (Object.prototype.hasOwnProperty.call(value, k)) {
                                v = str(k, value);
                                if (v) {
                                    partial.push(quote(k) + (gap ? ': ' : ':') + v);
                                }
                            }
                        }
                    }

                    // Join all of the member texts together, separated with commas,
                    // and wrap them in braces.

                    v = partial.length === 0
                        ? '{}'
                        : gap
                        ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
                        : '{' + partial.join(',') + '}';
                    gap = mind;
                    return v;
            }
        }

        // If the JSON object does not yet have a stringify method, give it one.

        if (typeof JSON.stringify !== 'function') {
            JSON.stringify = function (value, replacer, space) {

                // The stringify method takes a value and an optional replacer, and an optional
                // space parameter, and returns a JSON text. The replacer can be a function
                // that can replace values, or an array of strings that will select the keys.
                // A default replacer method can be provided. Use of the space parameter can
                // produce text that is more easily readable.

                var i;
                gap = '';
                indent = '';

                // If the space parameter is a number, make an indent string containing that
                // many spaces.

                if (typeof space === 'number') {
                    for (i = 0; i < space; i += 1) {
                        indent += ' ';
                    }

                    // If the space parameter is a string, it will be used as the indent string.

                } else if (typeof space === 'string') {
                    indent = space;
                }

                // If there is a replacer, it must be a function or an array.
                // Otherwise, throw an error.

                rep = replacer;
                if (replacer && typeof replacer !== 'function' &&
                        (typeof replacer !== 'object' ||
                        typeof replacer.length !== 'number')) {
                    throw new Error('JSON.stringify');
                }

                // Make a fake root object containing our value under the key of ''.
                // Return the result of stringifying the value.

                return str('', { '': value });
            };
        }


        // If the JSON object does not yet have a parse method, give it one.

        if (typeof JSON.parse !== 'function') {
            JSON.parse = function (text, reviver) {

                // The parse method takes a text and an optional reviver function, and returns
                // a JavaScript value if the text is a valid JSON text.

                var j;

                function walk(holder, key) {

                    // The walk method is used to recursively walk the resulting structure so
                    // that modifications can be made.

                    var k, v, value = holder[key];
                    if (value && typeof value === 'object') {
                        for (k in value) {
                            if (Object.prototype.hasOwnProperty.call(value, k)) {
                                v = walk(value, k);
                                if (v !== undefined) {
                                    value[k] = v;
                                } else {
                                    delete value[k];
                                }
                            }
                        }
                    }
                    return reviver.call(holder, key, value);
                }


                // Parsing happens in four stages. In the first stage, we replace certain
                // Unicode characters with escape sequences. JavaScript handles many characters
                // incorrectly, either silently deleting them, or treating them as line endings.

                text = String(text);
                cx.lastIndex = 0;
                if (cx.test(text)) {
                    text = text.replace(cx, function (a) {
                        return '\\u' +
                            ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                    });
                }

                // In the second stage, we run the text against regular expressions that look
                // for non-JSON patterns. We are especially concerned with '()' and 'new'
                // because they can cause invocation, and '=' because it can cause mutation.
                // But just to be safe, we want to reject all unexpected forms.

                // We split the second stage into 4 regexp operations in order to work around
                // crippling inefficiencies in IE's and Safari's regexp engines. First we
                // replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
                // replace all simple value tokens with ']' characters. Third, we delete all
                // open brackets that follow a colon or comma or that begin the text. Finally,
                // we look to see that the remaining characters are only whitespace or ']' or
                // ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

                if (/^[\],:{}\s]*$/
                        .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                            .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                            .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

                    // In the third stage we use the eval function to compile the text into a
                    // JavaScript structure. The '{' operator is subject to a syntactic ambiguity
                    // in JavaScript: it can begin a block or an object literal. We wrap the text
                    // in parens to eliminate the ambiguity.

                    j = eval('(' + text + ')');

                    // In the optional fourth stage, we recursively walk the new structure, passing
                    // each name/value pair to a reviver function for possible transformation.

                    return typeof reviver === 'function'
                        ? walk({ '': j }, '')
                        : j;
                }

                // If the text is not JSON parseable, then a SyntaxError is thrown.

                throw new SyntaxError('JSON.parse');
            };
        }
    }());
}

//########################################################################################################

//Nwjsface
//newww modefy from 
/*
 * JSFace Object Oriented Programming Library v2.2.0  
 * https://github.com/tnhu/jsface
 *
 * Copyright (c) 2009-2013 Tan Nhu
 * Licensed under MIT license (https://github.com/tnhu/jsface/blob/master/LICENSE.txt)
 */
//when 19/07/57
//for only fix concept of calling constructor of muntiple inheritance 

(function (context, OBJECT, NUMBER, LENGTH, toString, undefined //, oldClass, jsface
    ) {
    /**
     * Return a map itself or null. A map is a set of { key: value }
     * @param obj object to be checked
     * @return obj itself as a map or false
     */
    function mapOrNil(obj) { return (obj && typeof obj === OBJECT && !(typeof obj.length === NUMBER && !(obj.propertyIsEnumerable(LENGTH))) && obj) || null; }

    /**
     * Return an array itself or null
     * @param obj object to be checked
     * @return obj itself as an array or null
     */
    function arrayOrNil(obj) { return (obj && typeof obj === OBJECT && typeof obj.length === NUMBER && !(obj.propertyIsEnumerable(LENGTH)) && obj) || null; }

    /**
     * Return a function itself or null
     * @param obj object to be checked
     * @return obj itself as a function or null
     */
    function functionOrNil(obj) { return (obj && typeof obj === "function" && obj) || null; }

    /**
     * Return a string itself or null
     * @param obj object to be checked
     * @return obj itself as a string or null
     */
    function stringOrNil(obj) { return (toString.apply(obj) === "[object String]" && obj) || null; }

    /**
     * Return a class itself or null
     * @param obj object to be checked
     * @return obj itself as a class or false
     */
    function classOrNil(obj) { return (functionOrNil(obj) && (obj.prototype && obj === obj.prototype.constructor) && obj) || null; }

    /**
     * Util for extend() to copy a map of { key:value } to an object
     * @param key key
     * @param value value
     * @param ignoredKeys ignored keys
     * @param object object
     * @param iClass true if object is a class
     * @param oPrototype object prototype
     */
    function copier(key, value, ignoredKeys, object, iClass, oPrototype) {
        if (!ignoredKeys || !ignoredKeys.hasOwnProperty(key)) {
            object[key] = value;
            if (iClass) { oPrototype[key] = value; }                       // class? copy to prototype as well
        }
    }

    /**
     * Extend object from subject, ignore properties in ignoredKeys
     * @param object the child
     * @param subject the parent
     * @param ignoredKeys (optional) keys should not be copied to child
     */
    function extend(object, subject, ignoredKeys) {
        if (arrayOrNil(subject)) {
            for (var len = subject.length; --len >= 0;) { extend(object, subject[len], ignoredKeys); }
        } else {
            ignoredKeys = ignoredKeys || { constructor: 1, $super: 1, prototype: 1, $superp: 1 };

            var iClass = classOrNil(object),
                isSubClass = classOrNil(subject),
                oPrototype = object.prototype, supez, key, proto;

            // copy static properties and prototype.* to object
            if (mapOrNil(subject)) {
                for (key in subject) {
                    copier(key, subject[key], ignoredKeys, object, iClass, oPrototype);
                }
            }

            if (isSubClass) {
                proto = subject.prototype;
                for (key in proto) {
                    copier(key, proto[key], ignoredKeys, object, iClass, oPrototype);
                }
            }

            // prototype properties
            if (iClass && isSubClass) { extend(oPrototype, subject.prototype, ignoredKeys); }
        }
    }

    /**
     * Create a class.
     * @param parent parent class(es)
     * @param api class api
     * @return class
     */
    function Class(parent, api) {
        if (!api) {
            parent = (api = parent, 0);                                     // !api means there's no parent
        }

        var clazz, constructor, singleton, statics, key, bindTo, len, i = 0, p,
            ignoredKeys = { constructor: 1, $singleton: 1, $statics: 1, prototype: 1, $super: 1, $superp: 1, main: 1, toString: 0 },
            plugins = Class.plugins;

        api = (typeof api === "function" ? api() : api) || {};             // execute api if it's a function
        constructor = api.hasOwnProperty("constructor") ? api.constructor : 0;     // hasOwnProperty is a must, constructor is special
        singleton = api.$singleton;
        statics = api.$statics;

        // add plugins' keys into ignoredKeys
        for (key in plugins) { ignoredKeys[key] = 1; }

        // construct constructor
        clazz = singleton ? {} : (constructor ? constructor : function () { });

        // determine bindTo: where api should be bound
        bindTo = singleton ? clazz : clazz.prototype;

        // make sure parent is always an array
        parent = !parent || arrayOrNil(parent) ? parent : [parent];

        // do inherit
        len = parent && parent.length;
        while (i < len) {
            p = parent[i++];
            for (key in p) {
                if (!ignoredKeys[key]) {
                    bindTo[key] = p[key];
                    if (!singleton) { clazz[key] = p[key]; }
                }
            }
            for (key in p.prototype) { if (!ignoredKeys[key]) { bindTo[key] = p.prototype[key]; } }
        }

        // copy properties from api to bindTo
        for (key in api) {
            if (!ignoredKeys[key]) {
                bindTo[key] = api[key];
            }
        }

        // copy static properties from statics to both clazz and bindTo
        for (key in statics) { clazz[key] = bindTo[key] = statics[key]; }

        // if class is not a singleton, add $super and $superp
        if (!singleton) {
            p = parent && parent[0] || parent;
            //clazz.$super  = p;
            clazz.$super = parent;// clazz.$super = p;
            clazz.$superp = p && p.prototype ? p.prototype : p;
            bindTo.$class = clazz;
        }

        for (key in plugins) { plugins[key](clazz, parent, api); }                 // pass control to plugins
        if (functionOrNil(api.main)) { api.main.call(clazz, clazz); }              // execute main()
        return clazz;
    }

    /* Class plugins repository */
    Class.plugins = {};

    /* Initialization */
    Nwjsface = {
        Class: Class,
        extend: extend,
        mapOrNil: mapOrNil,
        arrayOrNil: arrayOrNil,
        functionOrNil: functionOrNil,
        stringOrNil: stringOrNil,
        classOrNil: classOrNil
    };


    //else
    {
        oldClass = context.Class;                                         // save current Class namespace
        context.Class = Class;                                                 // bind Class and jsface to global scope
        context.Nwjsface = Nwjsface;
        Nwjsface.noConflict = function () { context.Class = oldClass; };              // no conflict
    }

})(this, "object", "number", "length", Object.prototype.toString);


//########################################################################################################

// Nw helper Class
(function (context, undefined) {
    var Class = context.Class;

    function getClass(obj) {
        if (typeof obj === "undefined")
            return "undefined";
        if (obj === null)
            return "null";
        return Object.prototype.toString.call(obj)
          .match(/^\[object\s(.*)\]$/)[1];
    }

    var NwJsonSerializable = Class({

        constructor: function (className, isSendNull) {
            for (var prop in this) { this[prop] = this[prop]; }
            if (className) this.className = className;
        },

        formJsonObj: function (obj) {
            for (var prop in obj) {
                var objProp = obj[prop];
                if (objProp && objProp.className) {

                    var newClassStr = 'new context.' + objProp.className + '();';
                    try {
                        var classObj = eval(newClassStr);//new (context[objProp.className])();
                        classObj.formJsonObj(objProp);
                        objProp = classObj;
                    } catch (e) {

                    }
                }
                this[prop] = objProp;
            }
        },
        formJsonStr: function (jsonStr) {
            var obj = JSON.parse(jsonStr)
            this.formJsonObj(obj);
        },
        toJsonStr: function () {
            return JSON.stringify(this)
        },
        getObj: function () {
            var resultObj = {};
            for (var prop in this) {
                var val = this[prop];
                if (!Nwjsface.functionOrNil(val)) {
                    resultObj[prop] = val;
                }
            }
            return resultObj
        },
        getClass: function () {
            return getClass(this);
        }
    })

    var NwRing = Class(NwJsonSerializable, {

        currentVal: 0,
        max: 9,
        min: 0,

        constructor: function (val) {

            NwRing.$super[0].call(this, 'NwRing');

            if (val) { this.currentVal = val }
        },
        set: function (val) {
            this.currentVal = val
        },
        get: function () { return this.currentVal },

        next: function (num) {
            if (num == undefined) {
                num = 1;
            }

            if (num >= 0) {
                for (var i = 0; i < num; i++) {
                    this.currentVal = this.currentVal < this.max ? (this.currentVal + 1) : this.min;
                }
                return this.currentVal;
            } else {
                num = Math.abs(num);

                return this.back(num);
            }
        },
        back: function (num) {

            if (num == undefined) {
                num = 1;
            }

            if (num >= 0) {
                for (var i = 0; i < num; i++) {
                    this.currentVal = this.currentVal > this.min ? (this.currentVal - 1) : this.max;
                }

                return this.currentVal;
            } else {
                num = Math.abs(num);
                return this.next(num);
            }
        }
    });

    //if (typeof module !== "undefined" && module.exports) {                       // NodeJS/CommonJS
    //    module.exports = VsClss;
    //} else
    {
        context.NwJsonSerializable = NwJsonSerializable;
        context.NwRing = NwRing;
    }

})(this);

//########################################################################################################

//Nw 
//helper function and object
//Modefi from
//VsLib
//when  19/07/57
//for class patern
(function (context, undefined) {

    var Nw = context.Class({
        $singleton: true,

        DateTimeUtill: {
            getDateFromStrJson: function (dt) {
                /// <summary>getDateFromStrJson
                ///   <para> for IE get date from c# datetime json ,ex "2013-02-05T15:39:40"
                ///     or time formata "2012-12-27 19:40:37 UTC"
                ///     or Date(1245677)</para>
                /// </summary>
                /// <param name="dt" type="string">date time in string formate</param>
                /// <returns type="Date" />

                if (dt.indexOf) {

                    if (dt.indexOf('T') >= 0 && dt.indexOf('Z') < 0) {
                        dt += 'Z';
                    }
                    var returnDate = new Date(dt);

                    if (!returnDate.getTime()) {
                        if (dt.indexOf('UTC') >= 0) {

                            var usabeDt = dt.replace(' ', 'T').replace(' UTC', '');
                            return this.getDateFromStrJson(usabeDt);

                        }
                        else if (dt.indexOf('Date') >= 0) {
                            return this.dateFromWcfDate(dt);
                        }

                        else {
                            var ss = dt.split('T');
                            sd = ss[0],
                            st = ss[1],

                            ssd = sd.split('-');

                            st = st.split('Z')[0];
                            var sst = st.split(':');

                            returnDate =
                                new Date(
                               ssd[0],//year
                               ssd[1] - 1,//mouth 0-11
                               ssd[2],//day
                               sst[0],//hh
                               sst[1],//mm
                               sst[2].split('.')[0])//ss;
                        }
                    }
                    return returnDate;
                }
                else {
                    return dt;
                }
            },

            getDateFromStrJsonTZoffset: function (dt) {
                var datetime = this.getDateFromStrJson(dt);

                var tzOffset = datetime.getTimezoneOffset();

                return Nw.AddMinutes(datetime, tzOffset);
            },

            dateFormJson: function (dateJsonStr) {
                if (dateJsonStr && dateJsonStr.indexOf('Date') >= 0) {
                    return this.dateFromWcfDate(dateJsonStr);
                } else {
                    return this.dateFromJsJson(dateJsonStr);
                }
            },

            dateFromJsJson: function (dateJsonStr) {
                return new Date(dateJsonStr)
            },
            // <summary>for date forate is Date(1245677)</summary>
            dateFromWcfDate: function (wcfDate) {

                var nstr = wcfDate.replace(/\//g, ' ');

                return eval('new ' + nstr + ';');
            },

            //conver Date to wcf date Lik 'Date(1245677)'
            dateToWcfDate: function (jsDate) {

                function pad(number, length) {
                    var str = "" + number
                    while (str.length < length) {
                        str = '0' + str
                    }
                    return str
                }

                if (!jsDate.getTimezoneOffset) {
                    jsDate = dateFormJson(jsDate);
                }

                var offset = jsDate.getTimezoneOffset()
                offset = ((offset < 0 ? '+' : '-') + // Note the reversed sign!
                          pad(parseInt(Math.abs(offset / 60)), 2) +
                          pad(Math.abs(offset % 60), 2))


                return "\/Date(" + jsDate.getTime() + offset + ")\/";
                //  return '/Date(' + jsDate.valueOf() + '+00' +  Math.abs(jsDate.getTimezoneOffset()/60) + '0)/'Math.abs(jsDate.getTimezoneOffset() / 60)
            },

            // <summary>for c# DateTime String format as "yyyy/M/d HH:mm:ss"</summary>
            conVerToDateTimeStr: function (DateObj) {

                var DateTimeStrFormate = Nw.stringFormat("{0}/{1}/{2} {3}:{4}:{5}",
                    DateObj.getFullYear(),
                    DateObj.getMonth() + 1,
                    DateObj.getDate(),

                    DateObj.getHours(),
                    DateObj.getMinutes(),
                    DateObj.getSeconds()
                    );

                return DateTimeStrFormate;
            },

            // <summary>Format given date as "yyyy-mm-dd hh:ii:ss"</summary>    
            // <param name="date" type="Date">A Date object</param>
            dateFormat: function (date) {

                datetime = date.getFullYear() + "-" +
                           ((date.getMonth() < 9) ? "0" : "") + (date.getMonth() + 1) + "-" +
                           ((date.getDate() < 10) ? "0" : "") + date.getDate() + " " +
                           ((date.getHours() < 10) ? "0" : "") + date.getHours() + ":" +
                           ((date.getMinutes() < 10) ? "0" : "") + date.getMinutes() + ":" +
                           ((date.getSeconds() < 10) ? "0" : "") + date.getSeconds()
                return datetime;
            },

            dateFromTimeStr: function (tstr, baseDate) {

                baseDate = new Date();
                var tArr = tstr.split(':');
                var td = null;
                if (baseDate) {
                    td = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), tArr[0], tArr[1], tArr[2]);
                } else {
                    td = new Date(0, 0, 0, tArr[0], tArr[1], tArr[2]);
                }
                return td;
            },
            compareTimeStr: function (tstr1, tstr2) { //"h:m:s"->"2:40:23"

                var t1d = this.dateFromTimeStr(tstr1);
                var t2d = this.dateFromTimeStr(tstr2);
                return t1d - t2d;;

                //if (t1Arr[0] != t2Arr[0]) {
                //    return t1Arr[0] > t2Arr[0] ? 1 : -1;
                //}
                //else if (t1Arr[1] != t2Arr[1]) {
                //    return t1Arr[1] > t2Arr[1] ? 1 : -1;
                //}
                //else if (t1Arr[2] != t2Arr[2]) {
                //    return t1Arr[2] > t2Arr[2] ? 1 : -1;
                //}
                //else {
                //    return 0;
                //}
            },
            compareOnlyTime: function (date1, date2) {
                return date1.setFullYear(0, 0, 0) - date2.setFullYear(0, 0, 0);
            },
            compareWithoutTime: function (dateStart, dateEnd) {
                return date1.setHours(0, 0, 0, 0) - date2.setHours(0, 0, 0, 0);
            }
        },

        //#region for old code

        //for c# DateTime String format 
        conVerToDateTimeStr: function (DateObj) {
            return this.DateTimeUtill.conVerToDateTimeStr(DateObj);
        },

        //for IE get date from c# datetime json ,ex "2013-02-05T15:39:40"
        getDateFromStrJson: function (dt) {
            return this.DateTimeUtill.getDateFromStrJson(dt);
        },
        //#endregion

        mergeTimePeriod: function (timePeriodList) {
            /// <param name="timePeriodList" type="[{}]">
            ///Object like [{ timeBegin: obj.timeBegin, timeEnd: obj.timeEnd }] 
            ///</param>

            var length = timePeriodList.length;

            var lastPeriod = timePeriodList[0];

            lastPeriod.timeBegin = Nw.DateTimeUtill.getDateFromStrJson(lastPeriod.timeBegin);
            lastPeriod.timeEnd = Nw.DateTimeUtill.getDateFromStrJson(lastPeriod.timeEnd);

            var newTimePeriodList = [lastPeriod];

            for (var i = 1; i < length; i++) {
                var period = timePeriodList[i];
                period.timeBegin = Nw.DateTimeUtill.getDateFromStrJson(period.timeBegin);
                period.timeEnd = Nw.DateTimeUtill.getDateFromStrJson(period.timeEnd);

                var gab = period.timeBegin.getTime() - (lastPeriod.timeEnd.getTime());

                if (gab > 1000) {
                    // add new period
                    newTimePeriodList.push(period);
                    lastPeriod = period;
                } else {
                    // update lastPeroid
                    lastPeriod.timeEnd = period.timeEnd;
                }
            }

            return newTimePeriodList;
        },

        HtmPrint: function (elementID) {
            var _elementID = elementID

            var domElement = document.getElementById(_elementID);

            this.print = function (msg) {
                domElement.innerText = msg;
            }
            this.println = function (msg) {
                if (domElement.innerText) {
                    // domElement.innerText += '<br>' + msg;
                    domElement.innerHTML += '<br>' + msg;
                    //  $('#' + elementID).append('<br>' + msg);
                    //$element.text($element.text()+ msg);
                }
                else {
                    domElement.innerText = msg;
                }
            }

            this.printlnUp = function (msg) {
                if (domElement.innerText) {
                    // domElement.innerText += '<br>' + msg;
                    domElement.innerHTML = msg + '<br>' + domElement.innerHTML;
                    //  $('#' + elementID).append('<br>' + msg);
                    //$element.text($element.text()+ msg);
                }
                else {
                    domElement.innerText = msg;
                }
            }
        },

        //formating string
        //using ex stringFormat("{0}{1}",arg0,arg1); return string
        stringFormat: function () {
            //String.prototype.format = function () {
            //var formatted = arguments[0];
            //var args = arguments;
            //return formatted.replace(/{(\d+)}/g, function (match, number) {
            //    return typeof args[number + 1] != 'undefined'
            //      ? args[number + 1]
            //      : match
            //    ;
            //});
            //};

            var formatted = arguments[0];
            for (var i = 0; i < arguments.length; i++) {
                if (typeof arguments[i + 1] != 'undefined') {
                    var regexp = new RegExp('\\{' + i + '\\}', 'gi');
                    formatted = formatted.replace(regexp, arguments[i + 1]);
                }
            }
            return formatted;
        },

        //modefy from http://www.mojavelinux.com/articles/javascript_hashes.html
        HashTable: function (obj) {
            var length = 0,
             items = {},
            ineach = null;

            if (typeof $ !== 'undefined' && typeof $.each !== 'undefined') {
                ineach = $.each;
            } else {
                ineach = function (obj, callback) {

                    for (var i in obj) {
                        if (callback(i, obj[i])) {
                            break;
                        }
                    }
                };
            }


            /// fn has parameter (key ,item)
            var each = this.each = function (fn) {
                /// <summary>Looping in self hashtable<br/>
                /// ex.
                ///for (var k in items) {
                ///    //if (hasKey(k)) {
                ///    var item = items[k];
                ///    if (fn.call(item, k, item) === false) {
                ///        break;
                ///    }
                ///    //}
                ///}
                ///</summary>

                ineach(items, fn);
            }

            var hasKey = this.hasKey = function (key) {
                return items.hasOwnProperty(key);
            }


            var getItem = this.getItem = function (key) {
                return hasKey(key) ? items[key] : undefined;
            }


            for (var p in obj) {
                if (obj.hasOwnProperty(p)) {
                    items[p] = obj[p];
                    length++;
                }
            }

            this.getLength = function () {
                return length;
            }
            this.length = function () {
                return length;
            }

            this.addItem = function (key, value) {
                var previous = undefined;
                if (hasKey(key)) {
                    previous = items[key];
                }
                else {
                    length++;
                }
                items[key] = value;
                return previous;
            }

            //return object items
            this.getItems = function () {
                return items;
            }

            this.removeItem = function (key) {
                if (this.hasKey(key)) {
                    previous = items[key];
                    length--;
                    delete items[key];
                    return previous;
                }
                else {
                    return undefined;
                }
            }

            //ger [] of all key
            this.keys = function () {
                var keys = [];
                for (var k in items) {
                    if (hasKey(k)) {
                        keys.push(k);
                    }
                }
                return keys;
            }

            //get [] of all value
            this.values = function () {
                var values = [];
                for (var k in items) {
                    if (hasKey(k)) {
                        values.push(items[k]);
                    }
                }
                return values;
            }


            this.filter = function (fn) {
                var results = new Nw.HashTable();
                each(function (k, item) {
                    if (fn.call(this, k, item)) results.addItem(k, item);
                });
                return results;
            }

            this.fideItemByKeys = function (keyItemArr, fn) {
                var results = new Nw.HashTable();

                ineach(keyItemArr, function (index, keyItem) {
                    if (hasKey(keyItem)) {
                        var item = getItem(keyItem);
                        results.addItem(keyItem, item);
                        if (fn) { fn.call(this, keyItem, item); }
                    }
                });

                return results;
            }

            this.clear = function () {
                items = {}
                length = 0;
            }
        },

        //can replace all wiht async and some with step

        //using eachAsync example
        //
        //Nw.eachAsync(arr, function (index, obj) {
        //    hp.print(index);
        //}, 100 function(){//complete});
        // <param name="collection" type="[]"></param>
        // <param name="funcCallback" type="Function">function(key,item)</param>
        eachAsync: function (collection, funcCallback, timeOut, funcComplete) {

            var obj;
            var i = 0;
            var length = collection.length;

            var isRun = true;
            this.stop = function () {
                isRun = false;
            }
            //var timeOut = timeOut;
            if (isRun && length > 0) {
                timeOutFuction(collection, funcCallback, i, length, timeOut, funcComplete);
            }
            function timeOutFuction(collection, funcCallback, i, length, timeOut, funcComplete) {

                var obj = collection[i];
                var result = funcCallback.call(obj, i++, obj);

                if (isRun && (!result) && i < length) {
                    setTimeout(function () {
                        timeOutFuction(collection, funcCallback, i, length, timeOut, funcComplete);
                    }, timeOut);
                }
                else if (funcComplete) {
                    funcComplete.call(obj, --i, obj);
                }
            }


        },

        //using forAsync example
        //
        //var para = { index: 0 }
        //    Nw.forAsync(para, function (p) { return p.index < 10; }, function (p) { p.index++; },
        //        function (p) {
        //            hp.print(p.index);
        //            arr.push(p.index);
        //        }, 10,
        //         function () {
        //             Nw.eachAsync(arr, function (index, obj) {
        //                 hp.print(index);
        //             }, 100,
        //              function () {
        //                  hp.print("all complete");
        //              });
        //         });
        //for (alert->(1) ; funcCompare->(2) ; funcUpdate->(4)) {
        //    funcCallback->(3);
        //}
        forAsync: function (para, funcCompare, funcUpdate, funcCallback, timeOut, funcComplete) {

            if (funcCompare(para)) {
                timeOutFunc(para, funcCompare, funcUpdate, funcCallback, timeOut, funcComplete)
            }

            function timeOutFunc(para, funcCompare, funcUpdate, funcCallback, timeOut, funcComplete) {
                funcCallback(para);//->(3)
                funcUpdate(para);//->(4)
                if (funcCompare(para)) {//->(2)
                    setTimeout(function () {
                        timeOutFunc(para, funcCompare, funcUpdate, funcCallback, timeOut, funcComplete);
                    }, timeOut);
                }
                else if (funcComplete) {
                    funcComplete(para);
                }
            }
            //  Nw.timeOutFuction(collection, funcCallback, i, length, timeOut);
        },

        // for sync an Asynchonus method together
        SysncTarking: function () {
            //#region constructor
            var Qtark = [];
            var tarking = false;
            function processQtark() {
                if (Qtark.length > 0) {
                    tarking = true;

                    var tark = Qtark.shift();

                    var arg = tark.arg;
                    var callbackIndex = tark.callbackIndex;

                    if (typeof callbackIndex !== 'undefined') {
                        var oldCallback = arg[callbackIndex];

                        arg[callbackIndex] = function (data) {
                            if (oldCallback) {
                                oldCallback(data);
                            }
                            processQtark();
                        }
                    }

                    tark.func.apply(this, arg);
                } else {
                    tarking = false;
                }
            }
            //#endregion

            //push tark (fuction) into queue
            //argArr is argument or tark ex [arg1,arg2]
            //callbackIndex index of argArr that is function callback
            function pushAndRun(tark, argArr, callbackIndex) {
                Qtark.push({
                    arg: argArr,
                    func: tark,
                    callbackIndex: callbackIndex
                });

                if (!tarking && Qtark.length == 1) {
                    processQtark();
                }
            }
            this.pushAndRun = pushAndRun;
        },

        //invoke method Asynchonus with limit per timeout
        Invoker: function (invokeFunc, timeOut) {
            var invokeFunc;
            var timeOut = timeOut;

            var timer = null;

            if (invokeFunc) {
                invokeFunc = invokeFunc;
            }

            this.setInvokeFunc = function (func) {
                invokeFunc = func;
            }
            this.setTimeOut = function (t) {
                timeOut = t;
            }

            this.invoke = function () {
                if (!timer) {
                    var arg = arguments;
                    timer = setTimeout(function () {
                        invokeFunc.apply(this, arg);
                        timer = null;
                    }, timeOut);
                }
            }
        },

        /// using $.map
        //Get Array of arraySource that without in arrayCompare
        withoutArrayInArray: function (arraySource, arrayCompare) {
            return $.map(arraySource, function (value) {
                if ($.inArray(value, arrayCompare) < 0) {
                    return value;
                }
            });
        },

        //Get Array of arraySource that without kays in hashTableCompare
        withoutHasKeyInArray: function (arraySource, hashTableCompare) {
            return $.map(arraySource, function (value) {
                if (!hashTableCompare.hasKey(value)) {
                    return value;
                }
            });
        },

        //#region for Date adding

        AddYears: function (date, year) {
            var dat = new Date(date.valueOf())
            dat.setFullYear(dat.getFullYear() + year);
            return dat;
        },

        AddMonths: function (date, month) {
            var dat = new Date(date.valueOf())
            dat.setMonth(dat.getMonth() + month);
            return dat;
        },

        AddDays: function (date, days) {
            var dat = new Date(date.valueOf())
            dat.setDate(dat.getDate() + days);
            return dat;
        },

        AddHours: function (date, hours) {
            var dat = new Date(date.valueOf())
            dat.setHours(dat.getHours() + hours);
            return dat;
        },

        AddMinutes: function (date, minutes) {
            var dat = new Date(date.valueOf())
            dat.setMinutes(dat.getMinutes() + minutes);
            return dat;
        },

        AddSeconds: function (date, seconds) {
            var dat = new Date(date.valueOf())
            dat.setSeconds(dat.getSeconds() + seconds);
            return dat;
        },


        //#endregion

        /**Get URL parameter
       * http://www.netlobo.com/url_query_string_javascript.html
       */
        gup: function (name, hrefStr) {

            if (!hrefStr) {
                hrefStr = window.location.href;
            }

            name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
            var regexS = "[\\#?&]" + name + "=([^&#]*)";
            var regex = new RegExp(regexS);
            var results = regex.exec(hrefStr);
            if (results == null)
                return null;
            else
                return decodeURIComponent(results[1]);
        },
        //get url hash
        gupH: function (name, hrefStr) {

            if (!hrefStr) {
                hrefStr = window.location.href;
            }

            name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
            var regexS = "[\\#&]" + name + "=([^&#]*)";
            var regex = new RegExp(regexS);
            var results = regex.exec(hrefStr);
            if (results == null)
                return null;
            else
                return decodeURIComponent(results[1]);
        },

        gupObj: function (hrefStr, isH) {

            if (!hrefStr) {
                hrefStr = window.location.href;
            }

            var hashObj = {};

            if (!hrefStr) {
                hrefStr = window.location.href;
            }
            if (isH) {
                hrefStr = hrefStr.split('#').slice(-1)[0];
            }
            else {
                hrefStr = hrefStr.split('?').slice(-1)[0];
            }
            //if (hrefStr.indexOf('#') == 0) {
            //    hrefStr = hrefStr.slice(1);
            //}

            var hashArr = hrefStr.split('&');

            var hashArrlength = hashArr.length;
            for (var i = 0; i < hashArrlength; i++) {
                var hElem = hashArr[i].split('=');
                try { hashObj[hElem[0]] = decodeURIComponent(hElem[1]); } catch (e) { console.log(e); }

            }

            return hashObj;
        },

        gupHObj: function (hrefStr) {

            return Nw.gupObj(hrefStr, true);
        },

        setHObj: function (HObj, windowObj) {

            var hashArr = [];
            for (var i in HObj) {
                hashArr.push(i + '=' + HObj[i]);
            }

            var hashStr = hashArr.join('&');

            if (windowObj) {
                windowObj.location.hash = hashStr;
                return hashStr;
            }

            return hashStr
        },

        //check url has parametor or hash
        hasup: function () {
            return (window.location.href.indexOf('?') >= 0) || (window.location.href.indexOf('#') >= 0);
        },

        //get grobal uni id
        getGUID: function () {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        },

        //#region scriping method

        //http://www.codeproject.com/Articles/303796/How-to-Implement-Inheritance-in-Javascript
        InheritanceExtend: function (subClass, baseClass) {
            function inheritance() { }
            inheritance.prototype = baseClass.prototype;
            subClass.prototype = new inheritance();
            subClass.prototype.constructor = subClass;
            subClass.baseConstructor = baseClass;
            subClass.superClass = baseClass.prototype;
        },

        ///http://thudjs.tumblr.com/post/637855087/stylesheet-onload-or-lack-thereof
        loadStyleSheet: function (path, fn, scope) {

            //using loadStyleSheet example

            //loadStyleSheet('/path/to/my/stylesheet.css', function (success, link) {
            //    if (success) {
            //        // code to execute if the style sheet was loaded successfully
            //    }
            //    else {
            //        // code to execute if the style sheet failed to successfully
            //    }
            //});

            var head = document.getElementsByTagName('head')[0], // reference to document.head for appending/ removing link nodes
                link = document.createElement('link');           // create the link node
            link.setAttribute('href', path);
            link.setAttribute('rel', 'stylesheet');
            link.setAttribute('type', 'text/css');

            var sheet, cssRules;
            // get the correct properties to check for depending on the browser
            if ('sheet' in link) {
                sheet = 'sheet'; cssRules = 'cssRules';
            }
            else {
                sheet = 'styleSheet'; cssRules = 'rules';
            }

            var timeout_id = setInterval(function () {                     // start checking whether the style sheet has successfully loaded
                try {
                    if (link[sheet] && link[sheet][cssRules].length) { // SUCCESS! our style sheet has loaded
                        clearInterval(timeout_id);                      // clear the counters
                        clearTimeout(timeout_id);
                        fn.call(scope || window, true, link);           // fire the callback with success == true
                    }
                } catch (e) { } finally { }
            }, 10),                                                   // how often to check if the stylesheet is loaded
                timeout_id = setTimeout(function () {       // start counting down till fail
                    clearInterval(timeout_id);             // clear the counters
                    clearTimeout(timeout_id);
                    head.removeChild(link);                // since the style sheet didn't load, remove the link node from the DOM
                    fn.call(scope || window, false, link); // fire the callback with success == false
                }, 15000);                                 // how long to wait before failing

            head.appendChild(link);  // insert the link node into the DOM and start loading the style sheet

            return link; // return the link node;
        },

        //modefy from openlayers lib
        getScriptLocation: function (scriptName) {
            var r = new RegExp("(^|(.*?\\/))(" + scriptName + ")(\\?|$)"),
                s = document.getElementsByTagName('script'),
                src, m, l = "", len;

            for (var i = 0, len = s.length; i < len; i++) {
                src = s[i].getAttribute('src');
                if (src) {
                    m = src.match(r);
                    if (m) {
                        l = m[1];
                        break;
                    }
                }
            }
            return l;
        },
        initScript: function (jsFiles, scriptLocation) {

            if (scriptLocation) {
                Nw.insertedScripts(jsFiles, scriptLocation);
            } else {
                Nw.insertedScripts(jsFiles, "");
            }

        },

        ///must use this function before body render
        insertedScripts: function (jsFiles, host) {
            // use "parser-inserted scripts" for guaranteed execution order
            // http://hsivonen.iki.fi/script-execution/
            var scriptTags = new Array(jsFiles.length);

            for (var i = 0, len = jsFiles.length; i < len; i++) {
                scriptTags[i] = "<script src='" + host + jsFiles[i] + "'></script>";
            }
            if (scriptTags.length > 0) {
                document.write(scriptTags.join(""));
            }
        },

        inject_module: function (module_file) {
            console.log("inject_module " + module_file);

            var h = document.getElementsByTagName('head')[0];
            var s = document.createElement('script');
            s.type = 'text/javascript';
            s.src = module_file;
            h.appendChild(s);
        },

        initStylesheet: function (jsFiles, scriptLocation) {

            if (scriptLocation) {
                Nw.insertedStylesheet(jsFiles, scriptLocation);
            } else {
                Nw.insertedStylesheet(jsFiles, "");
            }

        },
        insertedStylesheet: function (jsFiles, host) {
            // use "parser-inserted scripts" for guaranteed execution order
            // http://hsivonen.iki.fi/script-execution/
            var scriptTags = new Array(jsFiles.length);

            for (var i = 0, len = jsFiles.length; i < len; i++) {
                scriptTags[i] = "<link href='" + host + jsFiles[i] + "' rel='stylesheet' />";
            }
            if (scriptTags.length > 0) {
                document.write(scriptTags.join(""));
            }
        },

        getScriptSync: function (urlScript) {
            //$.ajax({
            //    url: urlScript,
            //    async: false,
            //    dataType: "script",
            //});
        },

        getCurentScriptPath: function () {
            var scripts = document.getElementsByTagName('script');
            var path = scripts[scripts.length - 1].src.split('?')[0];      // remove any ?query
            var mydir = path.split('/').slice(0, -1).join('/') + '/';  // remove last filename part of path

            return mydir;

        },

        //#endregion

        getHost: function (location) {
            return location.protocol + "//" + location.host;
        },

        getHostName: function (location) {
            return location.protocol + "//" + location.hostname;
        },

        getBasePath: function (path) {
            return path.split('/').slice(0, -1).join('/') + '/'
        },

        getBaseFile: function (path) {
            var a = path.split('/').slice(-1)[0];

            return a.split('#')[0];
        },
        getRootUrl: function () {
            var url = (window.location != window.parent.location) ? document.referrer : document.location;
            return Nw.getBasePath(url.toString());
        },

        openPopup: function (url, name, w, h) {
            var myWindow = window.open(
              url, name,
              'width=' + w + ',height=' + h + '');

            return myWindow;
        },
        openWindow: function (url, name) {
            var myWindow = window.open(
              url, name);

            return myWindow;
        },
        popThisUp: function () {
            var url = window.location.href;
            var newwindow = window.open(url,
                '',// + Nw.getGUID(),
                'menuber=no,toorlbar=no,location=no,scrollbars=no, status=no,resizable=yes,' +
                'height=' + $(window).height() + ',width=' + $(window).width());
            if (window.focus) { newwindow.focus() }
            return url;
        },
        clone: function (obj) {
            // Handle the 3 simple types, and null or undefined
            if (null == obj || "object" != typeof obj) return obj;

            // Handle Date
            if (obj instanceof Date) {
                var copy = new Date();
                copy.setTime(obj.getTime());
                return copy;
            }

            // Handle Array
            if (obj instanceof Array) {
                var copy = [];
                for (var i = 0, len = obj.length; i < len; i++) {
                    copy[i] = this.clone(obj[i]);
                }
                return copy;
            }

            // Handle Object
            if (obj instanceof Object) {
                var copy = {};
                for (var attr in obj) {
                    if (obj.hasOwnProperty(attr)) copy[attr] = this.clone(obj[attr]);
                }
                return copy;
            }

            throw new Error("Unable to copy obj! Its type isn't supported.");
        },

        jqSubmit: function (actionUrl, reqObj) {

            var formElem = $('<form>').attr('action', actionUrl).attr('method', 'post');

            for (var i in reqObj) {
                var input = $('<input>').attr('type', 'hidden').attr('name', i).val(reqObj[i]);
                formElem.append(input);
            }

            $('body').append(formElem);

            formElem.submit();
        },
        localDownload: function (fileName, dataText, dataType) {

            if (!dataType) {
                dataType = 'text/json';
            }

            var uri = 'data:' + dataType + ';charset=utf-8,' + escape(dataText);

            var downloadLink = document.createElement("a");
            downloadLink.href = uri;
            downloadLink.download = fileName;

            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        },
        minObj: function (objArry, sortField) {

            var minObj = objArry[0];
            var min = minObj[sortField];

            for (var i = 1; i < objArry.length; i++) {

                var obj = objArry[i];
                var sortValue = obj[sortField];
                if (min > sortValue) {
                    minObj = obj;
                }
            }

            return minObj;
        },

        maxObj: function (objArry, sortField) {

            var maxObj = objArry[0];;
            var max = maxObj[sortField];

            for (var i = 1; i < objArry.length; i++) {

                var obj = objArry[i];
                var sortValue = obj[sortField];
                if (max < sortValue) {
                    maxObj = obj;
                }
            }

            return maxObj;
        }

        //,
        //setBaseWindow: function () {
        //    var baseHref = window.location.href;

        //    store.set('NwBaseUrl',baseHref);
        //},

        //getBaseWindow: function () {

        //    var baseWindow = window;

        //    while (baseWindow.parent) {
        //        baseWindow = baseWindow.parent;
        //    }

        //    return baseWindow;
        //    //var NwBaseUrl = store.get('NwBaseUrl');
        //    //var baseHref = window.location.href;

        //    //alert(baseHref);
        //}
    });

    //if (typeof module !== "undefined" && module.exports) {                       // NodeJS/CommonJS
    //    module.exports = Nw;
    //}
    //else
    {
        context.Nw = Nw;
    }

})(this);

//########################################################################################################


// NodeJS/CommonJS 
// export all lib to outside file
(function (context, undefined) {
    var NwLib = {};

    NwLib.Nwjsface = context.Nwjsface;
    NwLib.Nw = context.Nw;

    NwLib.NwRing = context.NwRing;
    NwLib.NwJsonSerializable = context.NwJsonSerializable;

    if (typeof module !== "undefined" && module.exports) {
        module.exports = NwLib;
    } else {
        context.NwLib = NwLib;
    }
})(this);

//v. 24-07-57 add gupObj
//v. 28-07-57 add compareDateOnlyTime
//v. 05-08-57 add minObj , maxObj
//v. 18-01-58 modify HashTable -> Jeach to ineach
//v. 05-02-58 modify SysncTarking
//v. 27-05-58 modify HashTable
//v. 29-07-58 modify HashTable