"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoSerializer = void 0;
const repo_1 = require("@quack/repo");
const mongodb_1 = require("mongodb");
class TodoSerializer {
    serializeModel(arg) {
        return (0, repo_1.removeUndefined)({
            _id: (0, repo_1.makeObjectId)(arg.id),
            shortname: arg.shortname,
            fileId: arg.fileId,
        });
    }
    serializeQuery(arg) {
        if (!arg)
            return {};
        return this.serializeModel(arg);
    }
    deserializeModel(arg) {
        if (typeof arg !== 'object' || arg === null) {
            return null;
        }
        return (0, repo_1.removeUndefined)({
            id: (0, repo_1.makeId)(arg._id),
            shortname: arg.shortname,
            fileId: arg.fileId,
        });
    }
    deserializeModelMany(arg) {
        return arg.map((c) => this.deserializeModel(c)).filter((c) => c !== null);
    }
    deserializeInsertedId(arg) {
        if (typeof arg === 'object' && arg !== null && 'insertedId' in arg && arg.insertedId instanceof mongodb_1.ObjectId) {
            return (0, repo_1.makeId)(arg.insertedId);
        }
        else {
            return null;
        }
    }
    serializeId(arg) {
        return { _id: (0, repo_1.makeObjectId)(arg.id) };
    }
}
exports.TodoSerializer = TodoSerializer;
//# sourceMappingURL=todoSerializer.js.map