import {
  ObjectId, Filter, InsertOneResult, Document,
} from 'mongodb';
import { Serializer, MongoId, Id } from '../types';
import { removeUndefined, makeObjectId, makeId } from '../util';
import { Channel, ChannelQuery, MongoChannel } from './channelTypes';

export class ChannelSerializer implements Serializer<ChannelQuery, Channel, MongoChannel> {
  serializeModel(arg: Channel): Document {
    return removeUndefined({
      _id: makeObjectId(arg.id),
      channelType: arg.channelType,
      name: arg.name,
      cid: arg.cid,
      private: arg.private,
      direct: arg.direct,
      users: arg.users?.map(makeObjectId).sort(),
    });
  }

  serializeQuery(arg: ChannelQuery): Filter<Document> {
    return removeUndefined({
      ...this.serializeModel(arg),
      ...(arg.userId ? { users: { $elemMatch: { $eq: makeObjectId(arg.userId) } } } : {}),
    });
  }

  deserializeModel(arg: MongoChannel): Channel | null {
    if (typeof arg !== 'object' || arg === null) {
      return null;
    }
    return removeUndefined({
      id: makeId(arg._id),
      channelType: arg.channelType,
      name: arg.name,
      cid: arg.cid,
      private: arg.private,
      direct: arg.direct,
      users: arg.users?.map(makeId).sort(),
    }) as Channel;
  }

  deserializeModelMany(arg: Array<MongoChannel>): Array<Channel> {
    return arg.map((c) => this.deserializeModel(c)).filter((c) => c !== null) as Array<Channel>;
  }

  deserializeInsertedId(arg: InsertOneResult<Document>): Id | null {
    if (typeof arg === 'object' && arg !== null && 'insertedId' in arg && arg.insertedId instanceof ObjectId) {
      return makeId(arg.insertedId);
    }
    return null;
  }

  serializeId(arg: { id: Id }): MongoId {
    return { _id: makeObjectId(arg.id) };
  }
}
