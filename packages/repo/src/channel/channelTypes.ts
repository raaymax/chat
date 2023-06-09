import { z } from 'zod';
import { ObjectId } from 'mongodb';
import { Id, ReplaceType, ReplaceId } from '../types';

export const Channel = z.object({
  id: Id,
  channelType: z.string(),
  name: z.string(),
  cid: z.string(),
  private: z.boolean(),
  direct: z.boolean(),
  users: z.array(Id),
});

export type Channel = z.infer<typeof Channel>;

export const ChannelQuery = Channel.extend({
  userId: Id,
});

export type ChannelQuery = z.infer<typeof ChannelQuery>;

export type MongoChannel = ReplaceType<ReplaceId<Channel>, Id, ObjectId>;
