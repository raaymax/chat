import {
  WithId, Document, InsertOneResult, Filter, ObjectId,
} from 'mongodb';
import {
  Id, MongoId, Serializer, WithoutUndefined,
} from '../types';
import {
  makeDate, makeId, makeObjectId, removeUndefined,
} from '../util';
import { MongoUser, User, UserQuery } from './userTypes';

export class UserSerializer implements Serializer<UserQuery, User, MongoUser> {
  serializeModel: (arg: User) => Document = (arg) => (arg ? removeUndefined({
    _id: makeObjectId(arg.id),
    name: arg.name,
    avatarUrl: arg.avatarUrl,
    login: arg.login,
    password: arg.password,
    clientId: arg.clientId,
    lastSeen: makeDate(arg.lastSeen),
    system: arg.system,
    mainChannelId: makeObjectId(arg.mainChannelId),
    avatarFileId: arg.avatarFileId,
    ...(arg.notifications ? Object.fromEntries(
      Object.entries(arg.notifications)
        .map(([k, v]) => ([
          `notifications.${k}`,
          { mobile: v.mobile, refreshedAt: makeDate(v.refreshedAt) },
        ])) || [],
    ) : {}),
    webPush: arg.webPush,
  }) : undefined);

  serializeQuery: (arg: UserQuery) => Filter<MongoUser> = (arg) => (arg ? removeUndefined({
    ...this.serializeModel(arg),
    ...(arg.ids ? { _id: { $in: arg.ids.map(makeObjectId) } } : {}),
  }) : undefined);

  deserializeModel: (arg: WithId<Document>) => User = (arg) => {
    if (typeof arg !== 'object' || arg === null) {
      return null;
    }
    return removeUndefined({
      id: makeId(arg._id),
      name: arg.name,
      avatarUrl: arg.avatarUrl,
      login: arg.login,
      password: arg.password,
      clientId: arg.clientId,
      lastSeen: makeDate(arg.lastSeen),
      system: arg.system,
      mainChannelId: makeId(arg.mainChannelId),
      avatarFileId: arg.avatarFileId,
      notifications: arg.notifications,
      webPush: arg.webPush,
    }) as User;
  };

  deserializeModelMany: (arg: WithId<Document>[]) => User[] = (arg) => (
    arg.map((c) => this.deserializeModel(c)).filter((c) => c !== null) as User[]
  );

  deserializeInsertedId(arg: InsertOneResult<Document>): Id | null {
    if (typeof arg === 'object' && arg !== null && 'insertedId' in arg && arg.insertedId instanceof ObjectId) {
      return arg.insertedId.toHexString() as Id;
    }
    return null;
  }

  serializeId(arg: { id: Id }): MongoId {
    return { _id: makeObjectId(arg.id) };
  }

  removeUndefined<T extends Record<string, unknown>>(arg: T): WithoutUndefined<T> {
    return Object.fromEntries(Object.entries(arg).filter(([, v]) => v !== undefined)) as WithoutUndefined<T>;
  }
}
