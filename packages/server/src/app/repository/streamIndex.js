const {
  StringType, NumberType, ObjectType,
} = require('./schemas');
const { createRepo } = require('./repo');

const TABLE_NAME = 'stream_insexes';

const Model = ObjectType({
  id: StringType({
    alt: '_id',
    serializeKey: (key) => (key === 'id' ? '_id' : key),
    deserializeKey: (key) => (key === '_id' ? 'id' : key),
  }),
  idx: NumberType(),
});

const Query = Model.extend({});

module.exports = createRepo(TABLE_NAME, Query, Model);
