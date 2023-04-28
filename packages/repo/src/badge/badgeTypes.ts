import { z } from 'zod';
import { ObjectId } from 'mongodb';
import { Id, ReplaceType, ReplaceId } from '../types';

export const Badge = z.object({
  id: Id,
  count: z.number(),
  channelId: Id,
  parentId: Id.nullable(),
  userId: Id,
  lastRead: z.date(),
  lastMessageId: Id,
});

export type Badge = z.infer<typeof Badge>;

export const BadgeQuery = Badge.extend({
  userId: Id,
});

export type BadgeQuery = z.infer<typeof BadgeQuery>;

export type MongoBadge = ReplaceType<ReplaceId<Badge>, Id, ObjectId>;
