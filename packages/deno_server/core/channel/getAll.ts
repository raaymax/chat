import {repo} from '../../infra/mod.ts';
import { Id } from '../types.ts';
import { createQuery } from "../helpers.ts";
import * as v from 'valibot';

export default createQuery({
  type: 'channel:getAll',
  body: v.required(v.object({
    userId: Id,
  })),
}, async (query) => {
  return await repo.channel.getAll(query);
});
