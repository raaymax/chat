"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoQuery = exports.Todo = void 0;
const zod_1 = require("zod");
const repo_1 = require("@quack/repo");
exports.Todo = zod_1.z.object({
    id: repo_1.Id,
    shortname: zod_1.z.string(),
    fileId: zod_1.z.string(),
});
exports.TodoQuery = exports.Todo.extend({});
//# sourceMappingURL=todoTypes.js.map