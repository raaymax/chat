/* eslint-disable no-nested-ternary */
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
  return query;
};

exports.deserialize = function deserialize(data) {
  if (!data) return data;
  if (Array.isArray(data)) {
    return data.map((item) => deserialize(item));
  }
  if (typeof data === 'object') {
    return Object.fromEntries(Object.entries(data).map(([key, value]) => {
      if (key === 'id') {
        return ['_id', Array.isArray(value)
          ? { $in: value.map((v) => (ObjectId.isValid(v) ? ObjectId(v) : v)) }
          : (ObjectId.isValid(value) ? ObjectId(value) : value)];
      }
      if (key.match(/Id$/)) {
        if (Array.isArray(value)) {
          return [key, value.map((v) => (ObjectId.isValid(v) ? ObjectId(v) : v))];
        }
        return [key, ObjectId.isValid(value) ? ObjectId(value) : value];
      }
      return [key, value];
    }));
  }
  return data;
};

exports.serializeInsert = function serializeInsert(data) {
  return Object.fromEntries(Object.entries(data).map(([key, value]) => {
    if (key === 'insertedId') {
      return ['id', value.toHexString()];
    }
    return [key, value];
  }));
};
