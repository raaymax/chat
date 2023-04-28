import { z } from 'zod';
import { ObjectId } from 'mongodb';
import { Id, ReplaceType, ReplaceId } from '../types';

export const Emoji = z.object({
  id: Id,
  shortname: z.string(),
  fileId: z.string(),
});

export type Emoji = z.infer<typeof Emoji>;

export const EmojiQuery = Emoji.extend({});

export type EmojiQuery = z.infer<typeof EmojiQuery>;

export type MongoEmoji = ReplaceType<ReplaceId<Emoji>, Id, ObjectId>;
