import * as v from 'valibot';
import { repo } from '../../infra/mod.ts';
import { createCommand } from "../helpers.ts";
import { Id } from '../types.ts';

export default createCommand({
  type: 'session:remove',
  body: v.object({
    sessionId: Id,
  }),
}, async ({ sessionId }) => {
  await repo.session.remove({ id: sessionId });
});

