import { z } from 'zod';
import { ObjectId } from 'mongodb';
import { Id, ReplaceType, ReplaceId } from '../types';

export const Session = z.object({
  id: Id,
  expires: z.date(),
  userId: Id,
  token: z.string(),
  lastIp: z.string(),
  lastUserAgent: z.string(),
});

export type Session = z.infer<typeof Session>;

export const SessionQuery = Session.extend({});

export type SessionQuery = z.infer<typeof SessionQuery>;

export type MongoSession = ReplaceType<ReplaceId<Session>, Id, ObjectId>;
