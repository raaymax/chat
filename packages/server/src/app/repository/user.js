const {
  IdType, StringType, DictionaryType, DateType, ObjectType, ArrayType, EmptyType,
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
  }), {
    serializeEntry: ([key, value]) => {
      const subKey = Object.keys(value)[0];
      return [`${key}.${subKey}`, value[subKey]];
    },
  }),
});

const Query = Model.extend({
  ids: EmptyType({
    serialize: (value) => ({ $in: ArrayType(IdType()).serialize(value) }),
    serializeKey: () => '_id',
  }),
});

module.exports = createRepo(TABLE_NAME, Query, Model);
