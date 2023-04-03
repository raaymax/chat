var trans = function (str, value) {
    var _a;
    var prop = str.split(':')[0];
    return _a = {}, _a[prop] = value, _a;
};
var a = trans('name:string', 'test');
a.name;
