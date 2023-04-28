import { Serializer, MongoId, Id} from '../types';
import { removeUndefined, makeObjectId, makeId } from '../util';
import { ObjectId, Filter, InsertOneResult, Document } from 'mongodb';
import { Badge, BadgeQuery, MongoBadge } from './badgeTypes';

export class BadgeSerializer implements Serializer<BadgeQuery, Badge, MongoBadge> {
  serializeModel(arg: Badge): Document{
    return removeUndefined({
      _id: makeObjectId(arg.id),
      count: arg.count,
      channelId: makeObjectId(arg.channelId),
      parentId: makeObjectId(arg.parentId),
      userId: makeObjectId(arg.userId),
      lastRead: arg.lastRead,
      lastMessageId: makeObjectId(arg.lastMessageId),
    });
  }

  serializeQuery(arg: BadgeQuery): Filter<Document>{
    return this.serializeModel(arg);
  }

  deserializeModel(arg: MongoBadge): Badge | null {
    if(typeof arg !== 'object' || arg === null) {
      return null;
    }
    return removeUndefined({
      id: makeId(arg._id),
      count: arg.count,
      channelId: makeId(arg.channelId),
      parentId: makeId(arg.parentId),
      userId: makeId(arg.userId),
      lastRead: arg.lastRead,
      lastMessageId: makeId(arg.lastMessageId),
    });
  }

  deserializeModelMany(arg: Array<MongoBadge>): Array<Badge>{
    return arg.map((c) => this.deserializeModel(c)).filter((c) => c !== null) as Array<Badge>;
  }


  deserializeInsertedId(arg: InsertOneResult<Document>): Id | null {
    if(typeof arg === 'object' && arg !== null && 'insertedId' in arg && arg.insertedId instanceof ObjectId) {
      return makeId(arg.insertedId);
    }else{
      return null;
    }
  }

  serializeId(arg: { id: Id }): MongoId {
    return { _id: makeObjectId(arg.id) };
  }
}


