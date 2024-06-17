import {repo} from '../../infra/mod.ts';
import { Id } from '../types.ts';
import { createQuery } from "../helpers.ts";
import * as v from 'valibot';

export default createQuery({
  type: 'session:get',
  body: v.object({
    id: v.optional(Id),
    token: v.optional(v.string()),
  }),
}, async (query: any) => {
  return await repo.session.get(query);
});
