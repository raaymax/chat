const {
  IdType, ObjectType, NumberType, DateType,
} = require('./schemas');
const { createRepo } = require('./repo');

const TABLE_NAME = 'badges';

const Model = ObjectType({
  id: IdType({ alt: '_id' }),
  count: NumberType(),
  channelId: IdType(),
  parentId: IdType({ nullable: true }),
  userId: IdType(),
  lastRead: DateType(),
  lastMessageId: IdType(),
});

const Query = Model.extend({});

const Repo = createRepo(TABLE_NAME, Query, Model);

module.exports = {
  ...Repo,

  increment: (where) => Repo.updateMany(Repo.Query.serialize(where), { count: 1 }, 'inc'),
  reset: (where) => Repo.updateMany(Repo.Query.serialize(where), { count: 0 }, 'set'),

};
