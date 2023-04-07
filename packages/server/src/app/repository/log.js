const {
  IdType, StringType, EmptyType, ObjectType,
} = require('./schemas');
const { createRepo } = require('./repo');

const Schema = ObjectType({
  id: IdType({ alt: '_id' }),
  scope: StringType(),
  clientId: StringType(),
  level: StringType(),
  args: EmptyType(),
  createdAt: EmptyType(),
});

const Query = Schema.extend({});

module.exports = createRepo('logs', Query, Schema);
