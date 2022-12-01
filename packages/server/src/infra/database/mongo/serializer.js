const { ObjectId } = require('./db');

exports.serialize = function serialize(query) {
  if (!query) return query;
  if (query instanceof Date) {
    return query;
  }
  if (query instanceof ObjectId) {
    return query.toHexString();
  }
  if (Array.isArray(query)) {
    return query.map(serialize);
  }
  if (typeof query === 'object') {
    return Object.fromEntries(
      Object.entries(query)
        .map(([key, value]) => [key === '_id' ? 'id' : key, serialize(value)]),
    );
  }
};
