"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plugin = require("js-plugin");
const manifest_json_1 = require("../../manifest.json");
plugin.register(Object.assign(Object.assign({}, manifest_json_1.default), { message: {
        part: ({ client }) => { },
    } }));
//# sourceMappingURL=index.js.map