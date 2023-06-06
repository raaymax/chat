import { z } from 'zod';
import { ObjectId } from 'mongodb';
import { Id, ReplaceType, ReplaceId } from '../types';

export const User = z.object({
  id: Id,
  name: z.string(),
  avatarUrl: z.string(),
  login: z.string(),
  password: z.string(),
  clientId: z.string(),
  mainChannelId: Id.nullable(),
  avatarFileId: z.string(),
  lastSeen: z.date(),
  system: z.boolean().default(false),
  notifications: z.record(z.string(), z.object({
    mobile: z.string(),
    refreshedAt: z.date(),
  })),
  webPush: z.record(z.string(), z.object({
    endpoint: z.string(),
    expirationTime: z.number().nullable(),
    keys: z.object({
      p256dh: z.string(),
      auth: z.string(),
    }),
  })),
});

export const UserQuery = User.extend({
  ids: z.array(Id),
});

export type User = z.infer<typeof User>;
export type UserQuery = z.infer<typeof UserQuery>;
export type MongoUser = ReplaceType<ReplaceId<User>, Id, ObjectId>;
