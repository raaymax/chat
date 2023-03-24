/* eslint-disable no-nested-ternary */
const { ObjectId } = require('../../infra/database');

const Type = (ext = {}) => {
  const type = {
    serialize: (value) => value,
    deserialize: (value) => value,
    serializeKey: (value) => value,
    deserializeKey: (value) => value,
    serializeEntry: ([key, value]) => [type.serializeKey(key), type.serialize(value)],
    deserializeEntry: ([key, value]) => [type.deserializeKey(key), type.deserialize(value)],
    ...ext,
  };
  return type;
};

const StringType = (ext = {}) => Type(ext);

const NumberType = (ext = {}) => Type(ext);

const BooleanType = (ext = {}) => Type(ext);

const EmptyType = (ext = {}) => Type(ext);

const DateType = (ext = {}) => Type({
  serialize: (value) => (value instanceof Date ? value : new Date(value)),
  deserialize: (value) => (value instanceof Date ? value : new Date(value)),
  ...ext,
});

const IdType = (ext = {}) => Type({
  serialize: (value) => ((ext.nullable && value === null)
    ? null
    : (value instanceof ObjectId ? value : ObjectId(value))),
  deserialize: (value) => ((ext.nullable && value === null)
    ? null
    : (value instanceof ObjectId ? value.toHexString() : value)),
  serializeKey: (key) => (key === 'id' ? '_id' : key),
  deserializeKey: (key) => (key === '_id' ? 'id' : key),
  ...ext,
});

const ObjectType = (Schema, ext = {}) => {
  const schemas = {};
  Object.entries(Schema).forEach(([key, schema]) => {
    schemas[key] = schema;
    if (schema.alt) schemas[schema.alt] = schema;
  });
  Schema._id = Schema.id;
  const serialize = (data) => {
    if (!data) return data;
    return Object.fromEntries(Object.entries(data)
      .filter(([, value]) => typeof value !== 'undefined')
      .filter(([key]) => schemas[key])
      .map((entry) => schemas[entry[0]].serializeEntry(entry)));
  };

  const deserialize = (data) => {
    if (!data) return data;
    return Object.fromEntries(Object.entries(data)
      .filter(([, value]) => typeof value !== 'undefined')
      .filter(([key]) => schemas[key])
      .map((entry) => schemas[entry[0]].deserializeEntry(entry)));
  };

  const extend = (extSchema) => ObjectType({ ...Schema, ...extSchema });

  return Type({
    serialize, deserialize, extend, ...ext,
  });
};

const DictionaryType = (keyType, valueType, ext = {}) => Type({
  serialize: (data) => {
    if (!data) return data;
    return Object.fromEntries(Object.entries(data)
      .filter(([, value]) => typeof value !== 'undefined')
      .map(([key, val]) => [keyType.serialize(key), valueType.serialize(val)]));
  },

  deserialize: (data) => {
    if (!data) return data;
    return Object.fromEntries(Object.entries(data)
      .filter(([, value]) => typeof value !== 'undefined')
      .map(([key, val]) => [keyType.deserialize(key), valueType.deserialize(val)]));
  },
  ...ext,
});

const ArrayType = (type, ext = {}) => Type({
  serialize: (value) => value.map((v) => type.serialize(v)),
  deserialize: (value) => value.map((v) => type.deserialize(v)),
  ...ext,
});

const InsertResult = ObjectType({
  insertedId: EmptyType({
    deserializeEntry: ([, value]) => [
      'id',
      IdType().deserialize(value),
    ],
  }),
});

module.exports = {
  ObjectType,
  StringType,
  NumberType,
  BooleanType,
  DictionaryType,
  DateType,
  IdType,
  EmptyType,
  ArrayType,
  InsertResult,
};
