﻿

(function () {
    function datenum(v, date1904) {
        if (date1904) v += 1462;
        var epoch = Date.parse(v);
        return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
    }

    function sheet_from_array_of_arrays(data, opts) {
        var ws = {};
        var range = { s: { c: 10000000, r: 10000000 }, e: { c: 0, r: 0 } };
        for (var R = 0; R != data.length; ++R) {
            for (var C = 0; C != data[R].length; ++C) {
                if (range.s.r > R) range.s.r = R;
                if (range.s.c > C) range.s.c = C;
                if (range.e.r < R) range.e.r = R;
                if (range.e.c < C) range.e.c = C;
                var cell = { v: data[R][C] };
                if (cell.v == null) continue;
                var cell_ref = XLSX.utils.encode_cell({ c: C, r: R });

                if (typeof cell.v === 'number') cell.t = 'n';
                else if (typeof cell.v === 'boolean') cell.t = 'b';
                else if (cell.v instanceof Date) {
                    cell.t = 'n'; cell.z = XLSX.SSF._table[14];
                    cell.v = datenum(cell.v);
                }
                else cell.t = 's';

                ws[cell_ref] = cell;
            }
        }
        if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
        return ws;
    }
    function Workbook() {
        if (!(this instanceof Workbook)) return new Workbook();
        this.SheetNames = [];
        this.Sheets = {};
    }
    function s2ab(s) {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    }

    this.SaveXlsx = function (dataArrayObject, ws_name, fileName) {
        var data = this.ArrayObjectToDataArray(dataArrayObject);
        console.log(data);
        this.SaveXlsxFromDataArray(data, ws_name, fileName);
    };
    this.ArrayObjectToDataArray = function (dataArrayObject) {

        var data = [];
        if (dataArrayObject.length > 0) {
            data.push(_.keys(dataArrayObject[0]));
            _.each(dataArrayObject, function (dataObj) {
                data.push(_.values(dataObj));
            });
        }
        return data;
    };
    this.SaveXlsxFromDataArray = function (data, ws_name, fileName) {
        var wb = new Workbook(), ws = sheet_from_array_of_arrays(data);

        /* add worksheet to workbook */
        wb.SheetNames.push(ws_name);
        wb.Sheets[ws_name] = ws;

        var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });

        saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), fileName + '.xlsx');
    };
    ///////// for read Xlsx//////////////////////////////
    function fixdata(data) {
        var o = "", l = 0, w = 10240;
        for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
        o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
        return o;
    }


    function to_json(workbook) {
        var result = {};
        workbook.SheetNames.forEach(function (sheetName) {
            var roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
            if (roa.length > 0) {
                result[sheetName] = roa;
            }
        });
        return result;
    }

    this.readXlsxToJson = function (f, isReadAsBinaryString, cb) {
        if (isReadAsBinaryString) {
            isReadAsBinaryString = (typeof FileReader.prototype.readAsBinaryString) !== "undefined";
        }

        var reader = new FileReader();
        reader.onload = function (e) {

            var data = e.target.result;
            var wb;
            if (isReadAsBinaryString) {
                wb = XLSX.read(data, { type: 'binary' });
            } else {
                var arr = fixdata(data);
                wb = XLSX.read(btoa(arr), { type: 'base64' });
            }
            cb(to_json(wb));

        };
        if (isReadAsBinaryString) reader.readAsBinaryString(f);
        else reader.readAsArrayBuffer(f);
    }

})();