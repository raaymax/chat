import {repo} from '../../infra/mod.ts';
import * as v from 'valibot';
import { createQuery } from "../helpers.ts";
import { Id } from '../types.ts';

export default createQuery({
  type: 'user:get',
  body: v.object({
    id: Id,
  }),
},async (query) => {
  return await repo.user.get(query);
});
