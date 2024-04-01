"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.omitUndefined = exports.buildEmojiNode = exports.createEventListener = exports.createCooldown = exports.createNotifier = exports.createCounter = exports.formatTime = exports.formatDateDetailed = exports.formatDate = exports.cn = void 0;
var DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var cn = function () {
    var classes = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        classes[_i] = arguments[_i];
    }
    return classes.flat().map(function (item) {
        if (typeof item === 'object' && item !== null) {
            return Object.entries(item).filter(function (_a) {
                var value = _a[1];
                return value;
            }).map(function (_a) {
                var key = _a[0];
                return key;
            });
        }
        return item;
    }).filter(Boolean).join(' ');
};
exports.cn = cn;
var formatDate = function (raw) {
    var date = raw ? new Date(raw) : new Date();
    return date.toLocaleDateString('pl-PL');
};
exports.formatDate = formatDate;
var formatDateDetailed = function (raw) {
    var date = raw ? new Date(raw) : new Date();
    return "".concat(DAYS[date.getDay()], ", ").concat(date.toLocaleDateString('pl-PL'));
};
exports.formatDateDetailed = formatDateDetailed;
var formatTime = function (raw) {
    var date = raw ? new Date(raw) : new Date();
    var minutes = date.getMinutes().toString();
    if (minutes.length === 1)
        minutes = "0".concat(minutes);
    return "".concat(date.getHours(), ":").concat(minutes);
};
exports.formatTime = formatTime;
var createCounter = function (prefix) {
    var counter = 0;
    return function () { return "".concat(prefix, ":").concat(counter++); };
};
exports.createCounter = createCounter;
var createNotifier = function () {
    var listeners = [];
    var cooldown = null;
    var notify = function (data) {
        if (cooldown)
            clearTimeout(cooldown);
        cooldown = setTimeout(function () { return listeners.forEach(function (l) { return l(data); }); }, 10);
    };
    var watch = function (handler) {
        listeners.push(handler);
        return function () { return listeners.splice(listeners.indexOf(handler), 1); };
    };
    return [notify, watch];
};
exports.createNotifier = createNotifier;
var createCooldown = function (fn, time) {
    var cooldown = false;
    return function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (!cooldown) {
                cooldown = true;
                setTimeout(function () { cooldown = false; }, time);
                return [2 /*return*/, fn()];
            }
            return [2 /*return*/];
        });
    }); };
};
exports.createCooldown = createCooldown;
var createEventListener = function () {
    var handlers = {};
    var notify = function (ev) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (!handlers[ev] || handlers[ev].length === 0) {
            // eslint-disable-next-line no-console
            console.log('Event not handled', ev, args);
        }
        return Promise.all((handlers[ev] || [])
            .map(function (listener) { return __awaiter(void 0, void 0, void 0, function () {
            var err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, listener.apply(void 0, args)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        err_1 = _a.sent();
                        // eslint-disable-next-line no-console
                        console.error(err_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); }));
    };
    var watch = function (ev, fn) {
        (handlers[ev] = handlers[ev] || []).push(fn);
    };
    var once = function (ev, fn) {
        handlers[ev] = handlers[ev] || [];
        var cb = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return __awaiter(void 0, void 0, void 0, function () {
                var idx;
                return __generator(this, function (_a) {
                    idx = handlers[ev].findIndex(function (c) { return c === cb; });
                    handlers[ev].splice(idx, 1);
                    return [2 /*return*/, fn.apply(void 0, args)];
                });
            });
        };
        handlers[ev].push(cb);
    };
    var exists = function (ev) { return Array.isArray(handlers[ev]) && handlers[ev].length > 0; };
    return {
        watch: watch,
        once: once,
        notify: notify,
        exists: exists,
    };
};
exports.createEventListener = createEventListener;
var buildEmojiNode = function (result, getUrl) {
    var emoji = (function () {
        if (result.unicode) {
            return document.createTextNode(String.fromCodePoint(parseInt(result.unicode, 16)));
        }
        if (result.fileId) {
            var img = document.createElement('img');
            img.src = getUrl(result.fileId);
            img.alt = result.shortname;
            return img;
        }
        return document.createTextNode(result.shortname);
    })();
    var node = document.createElement('span');
    node.className = 'emoji';
    node.setAttribute('emoji', result.shortname);
    node.setAttribute('contentEditable', 'false');
    node.appendChild(emoji);
    return node;
};
exports.buildEmojiNode = buildEmojiNode;
var omitUndefined = function (ob) { return Object.fromEntries(Object.entries(ob).filter(function (_a) {
    var v = _a[1];
    return v !== undefined;
})); };
exports.omitUndefined = omitUndefined;
