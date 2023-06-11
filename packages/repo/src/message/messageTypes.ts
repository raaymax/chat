import { z } from 'zod';
import { ObjectId } from 'mongodb';
import {
  Id, ReplaceType, ReplaceId, ClientId,
} from '../types';

export const Message = z.object({
  id: Id,
  flat: z.string(),
  message: z.any(),
  channelId: Id,
  userId: Id,
  parentId: Id,
  channel: z.string(),
  clientId: ClientId,
  emojiOnly: z.boolean(),
  pinned: z.boolean(),
  thread: z.array(z.object({
    userId: Id,
    childId: Id,
  })),
  reactions: z.array(z.object({
    userId: Id,
    reaction: z.string(),
  })),
  links: z.array(z.string()),
  mentions: z.array(z.string()),
  linkPreviews: z.array(z.any()),
  parsingErrors: z.array(z.any()),
  attachments: z.array(z.object({
    id: z.string(),
    fileName: z.string(),
    contentType: z.string(),
  })),
  updatedAt: z.date(),
  createdAt: z.date(),
});

export type Message = z.infer<typeof Message>;

export const MessageQuery = Message.extend({
  search: z.string(),
  before: z.date(),
  after: z.date(),
});

export type MessageQuery = z.infer<typeof MessageQuery>;

export type MongoMessage = ReplaceType<ReplaceId<Message>, Id, ObjectId>;
