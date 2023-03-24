const {
  IdType, StringType, BooleanType, ArrayType, EmptyType, ObjectType,
} = require('./schemas');
const { createRepo } = require('./repo');

const TABLE_NAME = 'channels';

const Model = ObjectType({
  id: IdType({ alt: '_id' }),
  name: StringType(),
  cid: StringType(),
  private: BooleanType(),
  users: ArrayType(IdType()),
});

const Query = ObjectType({
  id: IdType(),
  cid: StringType(),
  name: StringType(),
  private: BooleanType(),
  userId: EmptyType({
    serialize: (value) => ({ $elemMatch: { $eq: IdType().serialize(value) } }),
    serializeKey: () => 'users',
  }),
});

module.exports = createRepo(TABLE_NAME, Query, Model);
