const { db } = require('../../infra/database');
const {
  IdType, StringType, BooleanType, EmptyType, ObjectType, ArrayType, NumberType,
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
  streamIdx: NumberType(),
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
  aroundIdx: EmptyType({
    serialize: (value) => ({ $lte: value + 50, $gte: value - 50 }),
    serializeKey: () => 'streamIdx',
  }),
  beforeIdx: EmptyType({
    serialize: (value) => ({ $lte: value }),
    serializeKey: () => 'streamIdx',
  }),
  afterIdx: EmptyType({
    serialize: (value) => ({ $gte: value }),
    serializeKey: () => 'streamIdx',
  }),
  page: EmptyType({
    serialize: (value) => ({ $gte: value * 20, $lte: value * 20 + 19 }),
    serializeKey: () => 'streamIdx',
  }),
});

const MessageRepo = createRepo('messages', MessageQuerySchema, MessageSchema);

module.exports = {
  ...MessageRepo,
  getAll: async (arg, { limit = 50, offset = 0, order = 1 } = {}) => {
    const query = MessageRepo.Query.serialize(arg);

    const raw = await (await db)
      .collection(MessageRepo.TABLE_NAME)
      .find(query)
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
