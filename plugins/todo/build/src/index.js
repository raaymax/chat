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
Object.defineProperty(exports, "__esModule", { value: true });
exports.commands = exports.manifest = void 0;
const manifest = require("../manifest.json");
exports.manifest = manifest;
exports.commands = {
    name: 'time',
    description: 'returns server time',
    handler: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        yield res.systemMessage([
            { text: new Date().toISOString() },
        ]);
        res.ok();
    }),
};
//# sourceMappingURL=index.js.map