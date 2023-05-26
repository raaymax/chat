import {
  ObjectId, Filter, WithId, InsertOneResult, Document,
} from 'mongodb';
import {
  Serializer, MongoId, Id, WithoutUndefined,
} from '../types';
import {
  removeUndefined, makeObjectId, makeId, makeDate,
} from '../util';
import { Message, MessageQuery, MongoMessage } from './messageTypes';

export class MessageSerializer implements Serializer<MessageQuery, Message, MongoMessage> {
  serializeModel(arg: Message): Document {
    return removeUndefined({
      _id: makeObjectId(arg.id),
      flat: arg.flat,
      message: arg.message,
      channelId: makeObjectId(arg.channelId),
      userId: makeObjectId(arg.userId),
      parentId: makeObjectId(arg.parentId),
      channel: arg.channel,
      clientId: arg.clientId,
      emojiOnly: arg.emojiOnly,
      pinned: arg.pinned,
      thread: arg.thread?.map((t) => ({
        userId: makeObjectId(t.userId),
        childId: makeObjectId(t.childId),
      })),
      reactions: arg.reactions?.map((r) => ({
        userId: makeObjectId(r.userId),
        reaction: r.reaction,
      })),
      links: arg.links,
      linkPreviews: arg.linkPreviews,
      parsingErrors: arg.parsingErrors,
      attachments: arg.attachments,
      updatedAt: arg.updatedAt,
      createdAt: arg.createdAt,
    });
  }

  serializeQuery(arg: MessageQuery): Filter<Document> {
    return removeUndefined({
      ...this.serializeModel(arg),
      ...(arg.search ? { $text: { $search: arg.search } } : {}),
      ...(arg.before ? { createdAt: { $lte: makeDate(arg.before) } } : {}),
      ...(arg.after ? { createdAt: { $gte: makeDate(arg.after) } } : {}),
    });
  }

  deserializeModel(arg: MongoMessage): Message | null {
    if (typeof arg !== 'object' || arg === null) {
      return null;
    }
    return removeUndefined({
      id: makeId(arg._id),
      flat: arg.flat,
      message: arg.message,
      channelId: makeId(arg.channelId),
      userId: makeId(arg.userId),
      parentId: makeId(arg.parentId),
      channel: arg.channel,
      clientId: arg.clientId,
      emojiOnly: arg.emojiOnly,
      pinned: arg.pinned,
      thread: arg.thread?.map((t) => ({
        userId: makeId(t.userId),
        childId: makeId(t.childId),
      })),
      reactions: arg.reactions?.map((r) => ({
        userId: makeId(r.userId),
        reaction: r.reaction,
      })),
      links: arg.links,
      linkPreviews: arg.linkPreviews,
      parsingErrors: arg.parsingErrors,
      attachments: arg.attachments,
      updatedAt: arg.updatedAt,
      createdAt: arg.createdAt,
    }) as Message;
  }

  deserializeModelMany(arg: Array<WithId<Document>>): Array<Message> {
    return arg.map(this.deserializeModel);
  }

  deserializeInsertedId(arg: InsertOneResult<Document>): Id | null {
    if (typeof arg === 'object' && arg !== null && 'insertedId' in arg && arg.insertedId instanceof ObjectId) {
      return arg.insertedId.toHexString() as Id;
    }
    return null;
  }

  serializeId(arg: { id: Id }): MongoId {
    return { _id: new ObjectId(arg.id) };
  }
}
