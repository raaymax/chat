import {
  WithId, Document, InsertOneResult, Filter, ObjectId,
} from 'mongodb';
import {
  Id, MongoId, Serializer, WithoutUndefined,
} from '../types';
import {
  makeDate, makeId, makeObjectId, removeUndefined,
} from '../util';
import { MongoInvitation, Invitation, InvitationQuery } from './invitationTypes';

export class InvitationSerializer implements Serializer<InvitationQuery, Invitation, MongoInvitation> {
  serializeModel: (arg: Invitation) => Document = (arg) => (arg ? removeUndefined({
    _id: makeObjectId(arg.id),
    token: arg.token,
    userId: makeObjectId(arg.userId),
    createdAt: makeDate(arg.createdAt),
  }) : undefined);

  serializeQuery: (arg: InvitationQuery) => Filter<MongoInvitation> = (arg) => (arg ? removeUndefined({
    ...this.serializeModel(arg),
  }) : undefined);

  deserializeModel: (arg: WithId<Document>) => Invitation = (arg) => {
    if (typeof arg !== 'object' || arg === null) {
      return null;
    }
    return removeUndefined({
      id: makeId(arg._id),
      token: arg.token,
      userId: makeId(arg.userId),
      createdAt: makeDate(arg.createdAt),
    }) as Invitation;
  };

  deserializeModelMany: (arg: WithId<Document>[]) => Invitation[] = (arg) => (
    arg.map((c) => this.deserializeModel(c)).filter((c) => c !== null) as Invitation[]
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
