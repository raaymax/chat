const {
  IdType, StringType, ObjectType,
} = require('./schemas');
const { createRepo } = require('./repo');

const TABLE_NAME = 'emojis';

const Model = ObjectType({
  id: IdType({ alt: '_id' }),
  shortname: StringType(),
  fileId: StringType(),
});

const Query = Model.extend({});

module.exports = createRepo(TABLE_NAME, Query, Model);
