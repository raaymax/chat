"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromDom = void 0;
var utils_1 = require("./utils");
var fromDom = function (dom) {
    var _a, _b, _c;
    var command = ((_a = dom.textContent) !== null && _a !== void 0 ? _a : '').trim().match(/^\/\w+( \S+)*/);
    if (command) {
        var m = ((_b = dom.textContent) !== null && _b !== void 0 ? _b : '').trim().replace('\n', '').slice(1).split(/\s+/);
        return {
            type: 'command:execute',
            clientId: tempId(),
            createdAt: new Date().toISOString(),
            info: null,
            name: m[0],
            args: m.splice(1),
            flat: (_c = dom.textContent) !== null && _c !== void 0 ? _c : '',
        };
    }
    if (dom.childNodes.length === 0) {
        return {
            type: 'message:create',
            clientId: tempId(),
            createdAt: new Date().toISOString(),
            info: null,
            message: [],
            flat: '',
        };
    }
    var info = {
        links: [],
        mentions: [],
    };
    var tree = mapNodes(dom, info);
    return __assign({ type: 'message:create', clientId: tempId(), createdAt: new Date().toISOString(), info: null, message: trim(tree), emojiOnly: isEmojiOnly(tree), flat: flatten(tree), parsingErrors: info.errors }, info);
};
exports.fromDom = fromDom;
function is(data, key) {
    return data[key] !== undefined;
}
//FIXME: There is no way of searching messages using mentions or channel links 
function flatten(tree) {
    return [tree].flat().map(function (n) {
        if (is(n, 'blockquote'))
            return flatten(n.blockquote);
        if (is(n, 'bold'))
            return flatten(n.bold);
        if (is(n, 'br'))
            return '\n';
        if (is(n, 'bullet'))
            return flatten(n.bullet);
        if (is(n, 'channel'))
            return n.channel;
        if (is(n, 'code'))
            return n.code;
        if (is(n, 'codeblock'))
            return n.codeblock;
        if (is(n, 'emoji'))
            return n.emoji;
        if (is(n, 'img'))
            return n.img.alt;
        if (is(n, 'italic'))
            return flatten(n.italic);
        if (is(n, 'item'))
            return flatten(n.item);
        if (is(n, 'line'))
            return [flatten(n.line), '\n'];
        if (is(n, 'link'))
            return flatten(n.link.children);
        if (is(n, 'ordered'))
            return flatten(n.ordered);
        if (is(n, 'strike'))
            return flatten(n.strike);
        if (is(n, 'text'))
            return n.text;
        if (is(n, 'thread'))
            return n.thread.text;
        if (is(n, 'underline'))
            return flatten(n.underline);
        if (is(n, 'user'))
            return n.user;
        // eslint-disable-next-line no-console
        console.log('unknown node', n);
        return '';
    }).flat().join('');
}
var mapNodes = function (dom, info) { return (!dom.childNodes ? [] : __spreadArray([], dom.childNodes, true).map(function (n) {
    var _a, _b, _c, _d, _e, _f, _g;
    if (n.nodeName === '#text')
        return processUrls((_a = n.nodeValue) !== null && _a !== void 0 ? _a : '', info);
    if (n.nodeName === 'U')
        return { underline: mapNodes(n, info) };
    if (n.nodeName === 'CODE')
        return { code: (_b = n.nodeValue) !== null && _b !== void 0 ? _b : '' };
    if (n.nodeName === 'A')
        return { link: { href: (_c = n.getAttribute('href')) !== null && _c !== void 0 ? _c : '', children: mapNodes(n, info) } };
    if (n.nodeName === 'B')
        return { bold: mapNodes(n, info) };
    if (n.nodeName === 'I')
        return { italic: mapNodes(n, info) };
    if (n.nodeName === 'S')
        return { strike: mapNodes(n, info) };
    if (n.nodeName === 'DIV')
        return { line: mapNodes(n, info) };
    if (n.nodeName === 'UL')
        return { bullet: mapNodes(n, info) };
    if (n.nodeName === 'LI')
        return { item: mapNodes(n, info) };
    if (n.nodeName === 'IMG')
        return { img: { src: (_d = n.getAttribute('src')) !== null && _d !== void 0 ? _d : '', alt: (_e = n.getAttribute('alt')) !== null && _e !== void 0 ? _e : '' } };
    if (n.nodeName === 'SPAN' && n.className === 'emoji')
        return { emoji: (_f = n.getAttribute('emoji')) !== null && _f !== void 0 ? _f : '' };
    if (n.nodeName === 'SPAN' && n.className === 'channel')
        return { channel: (_g = n.getAttribute('channelId')) !== null && _g !== void 0 ? _g : '' };
    if (n.nodeName === 'SPAN' && n.className === 'user')
        return processUser(n, info);
    if (n.nodeName === 'SPAN')
        return mapNodes(n, info);
    if (n.nodeName === 'BR')
        return { br: true };
    // eslint-disable-next-line no-console
    console.log('unknown node', n, n.nodeName);
    info.errors = info.errors || [];
    info.errors.push({
        message: 'unknown node',
        nodeAttributes: Object.keys(n.attributes)
            .reduce(function (acc, key) {
            var _a;
            return (__assign(__assign({}, acc), (_a = {}, _a[key] = n.getAttribute(key), _a)));
        }, {}),
        nodeName: n.nodeName
    });
    return { text: '' };
}).flat()); };
function processUser(n, info) {
    var userId = n.getAttribute('userId');
    if (!userId) {
        // eslint-disable-next-line no-console
        console.log('no userId', n);
        info.errors = info.errors || [];
        info.errors.push({
            message: 'no userId',
            nodeAttributes: Object.keys(n.attributes)
                .reduce(function (acc, key) {
                var _a;
                return (__assign(__assign({}, acc), (_a = {}, _a[key] = n.getAttribute(key), _a)));
            }, {}),
            nodeName: n.nodeName
        });
        return { user: '' };
    }
    info.mentions.push(userId);
    return { user: userId };
}
function processUrls(text, info) {
    var m = matchUrl(text);
    if (m) {
        var parts = text.split(m[0]);
        info.links.push(m[0]);
        return __spreadArray([
            { text: parts[0] },
            { link: { href: m[0], children: [{ text: m[0] }] } }
        ], [processUrls(parts[1], info)].flat(), true);
    }
    return [{ text: text }];
}
// eslint-disable-next-line no-useless-escape
var matchUrl = function (text) { return text.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!,@:%_\+.~#?&\/\/=]*)/g); };
var trim = function (arr) {
    var copy = [arr].flat();
    var startIdx = copy.findIndex(function (e) { var _a; return !(e.text === '' || e.text === '\u200B' || e.text === '\u00A0' || ((_a = e.text) === null || _a === void 0 ? void 0 : _a.trim()) === '' || e.br === true); });
    var endIdx = copy.findLastIndex(function (e) { var _a; return !(e.text === '' || e.text === '\u200B' || e.text === '\u00A0' || ((_a = e.text) === null || _a === void 0 ? void 0 : _a.trim()) === '' || e.br === true); });
    return copy.slice(startIdx, endIdx + 1);
};
var isEmojiOnly = function (tree) {
    var a = [trim(tree)].flat();
    if (a.length === 1 && is(a[0], 'emoji'))
        return true;
    if (a.length === 1 && is(a[0], 'line')) {
        return isEmojiOnly(a[0].line);
    }
    return false;
};
var tempId = (0, utils_1.createCounter)("temp:".concat((Math.random() + 1).toString(36)));
