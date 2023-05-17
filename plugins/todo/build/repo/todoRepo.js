"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoRepo = void 0;
const repo_1 = require("@quack/repo");
const todoSerializer_1 = require("./todoSerializer");
class TodoRepo extends repo_1.Repo {
    constructor() {
        super('todos', new todoSerializer_1.TodoSerializer());
    }
}
exports.TodoRepo = TodoRepo;
//# sourceMappingURL=todoRepo.js.map