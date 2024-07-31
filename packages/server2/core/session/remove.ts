import * as v from 'valibot';
import { createCommandHandler } from '../command.ts';
import { repo } from '../../infra/mod.ts';

export default createCommandHandler({
  type: 'session:remove',
  body: v.object({
    sessionId: v.string()
  }),
}, async ({ sessionId }) => {
  await repo.session.remove({ id: sessionId });
});

