import { ObjectId } from 'mongodb';
import { Id, ReplaceId, ReplaceType } from '../types';

export type Invitation = {
  id: Id,
  token: string,
  userId:Id,
  createdAt: Date,
};

export type InvitationQuery = Invitation;

export type MongoInvitation = ReplaceType<ReplaceId<Invitation>, Id, ObjectId>;
