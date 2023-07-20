import { z } from 'zod';
import { Id, ReplaceId } from '../types';

export const Session = z.object({
  id: Id,
  expires: z.date(),
  session: z.object({
    cookie: z.object({
      originalMaxAge: z.number().nullable(),
      expires: z.date().nullable(),
      secure: z.boolean().nullable(),
      httpOnly: z.boolean(),
      domain: z.string().nullable(),
      path: z.string(),
      sameSite: z.string(),
    }),
    userId: Id,
    token: z.string(),
  }),
});

export type Session = z.infer<typeof Session>;

export const SessionQuery = Session.extend({});

export type SessionQuery = z.infer<typeof SessionQuery>;

export type MongoSession = ReplaceId<Session>;
