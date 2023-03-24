const {
  IdType, StringType, DictionaryType, DateType, ObjectType,
} = require('./schemas');
const { createRepo } = require('./repo');

const TABLE_NAME = 'users';

const Model = ObjectType({
  id: IdType({ alt: '_id' }),
  name: StringType(),
  avatarUrl: StringType(),
  login: StringType(),
  password: StringType(),
  clientId: StringType(),
  mainChannelId: IdType({ nullable: true }),
  notifications: DictionaryType(StringType(), ObjectType({
    mobile: StringType(),
    refreshedAt: DateType(),
  })),
});

const Query = Model.extend({});

module.exports = createRepo(TABLE_NAME, Query, Model);
