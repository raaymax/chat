import {
  ObjectId, Filter, InsertOneResult, Document,
} from 'mongodb';
import { Serializer, MongoId, Id } from '../types';
import { removeUndefined, makeObjectId, makeId } from '../util';
import { Session, SessionQuery, MongoSession } from './sessionTypes';

export class SessionSerializer implements Serializer<SessionQuery, Session, MongoSession> {
  serializeModel(arg: Session): Document {
    return removeUndefined({
      _id: makeObjectId(arg.id),
      expires: arg.expires,
      userId: makeObjectId(arg.userId),
      token: arg.token,
      lastIp: arg.lastIp,
      lastUserAgent: arg.lastUserAgent,
    });
  }

  serializeQuery(arg: SessionQuery): Filter<Document> {
    return this.serializeModel(arg);
  }

  deserializeModel(arg: MongoSession): Session | null {
    if (typeof arg !== 'object' || arg === null) {
      return null;
    }
    return removeUndefined({
      id: makeId(arg._id),
      expires: arg.expires,
      userId: makeId(arg.userId),
      token: arg.token,
      lastIp: arg.lastIp,
      lastUserAgent: arg.lastUserAgent,
    }) as Session;
  }

  deserializeModelMany(arg: Array<MongoSession>): Array<Session> {
    return arg.map((c) => this.deserializeModel(c)).filter((c) => c !== null) as Array<Session>;
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
