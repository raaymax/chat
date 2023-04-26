const { db } = require('../../infra/database');
const {
  IdType, StringType, BooleanType, EmptyType, ObjectType, ArrayType,
} = require('./schemas');
const { createRepo } = require('./repo');

const ThreadSchema = ObjectType({
  userId: IdType(),
  childId: IdType(),
});

const MessageSchema = ObjectType({
  id: IdType({ alt: '_id' }),
  flat: StringType(),
  message: EmptyType(),
  channelId: IdType(),
  userId: IdType(),
  parentId: IdType(),
  channel: StringType(),
  clientId: StringType(),
  emojiOnly: BooleanType(),
  pinned: BooleanType(),
  thread: ArrayType(
    ObjectType({
      userId: IdType(),
      childId: IdType(),
    }),
  ),
  reactions: ArrayType(
    ObjectType({
      userId: IdType(),
      reaction: StringType(),
    }),
  ),
  links: ArrayType(StringType()),
  linkPreviews: ArrayType(EmptyType()),
  parsingErrors: ArrayType(EmptyType()),
  attachments: ArrayType(
    ObjectType({
      id: StringType(),
      fileName: StringType(),
      contentType: StringType(),
    }),
  ),
  updatedAt: EmptyType(),
  createdAt: EmptyType(),
});

const MessageQuerySchema = MessageSchema.extend({
  search: EmptyType({
    serialize: (value) => ({ $search: value }),
    serializeKey: () => '$text',
  }),
  before: EmptyType({
    serialize: (value) => ({ $lte: new Date(value) }),
    serializeKey: () => 'createdAt',
  }),
  after: EmptyType({
    serialize: (value) => ({ $gte: new Date(value) }),
    serializeKey: () => 'createdAt',
  }),
});

const MessageRepo = createRepo('messages', MessageQuerySchema, MessageSchema);

const quickFix = (query) => {
  if (!query.parentId) {
    query.parentId = { $exists: false };
  }
  return query;
};

module.exports = {
  ...MessageRepo,
  getAll: async (arg, { limit = 50, offset = 0, order = 1 } = {}) => {
    const query = MessageRepo.Query.serialize(arg);

    const raw = await (await db)
      .collection(MessageRepo.TABLE_NAME)
      .find(quickFix(query))
      .sort({ createdAt: order })
      .skip(offset)
      .limit(limit)
      .toArray();

    const ret = ArrayType(MessageRepo.Model).deserialize(raw);
    return ret;
  },

  updateThread: async ({ parentId, userId, id }) => (await db)
    .collection(MessageRepo.TABLE_NAME)
    .updateOne(MessageRepo.Query.serialize({
      id: parentId,
    }), {
      $push: {
        thread: ThreadSchema.serialize({
          userId,
          childId: id,
        }),
      },
      $set: {
        updatedAt: new Date(),
      },
    }),
};
