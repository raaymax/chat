import { z } from 'zod';
import { ObjectId } from 'mongodb';
import { Id, ReplaceType, ReplaceId } from '../types';

export const StreamIndex = z.object({
  id: Id,
  key: z.string(),
  idx: z.number(),
});

export type StreamIndex = z.infer<typeof StreamIndex>;

export const StreamIndexQuery = StreamIndex.extend({});

export type StreamIndexQuery = z.infer<typeof StreamIndexQuery>;

export type MongoStreamIndex = ReplaceType<ReplaceId<StreamIndex>, Id, ObjectId>;
