import { Router } from '@planigale/planigale';
import { Core } from "../../../../core/mod.ts";

import getAll from './getAll.ts';
import create from './create.ts';
import remove from './remove.ts';
import update from './update.ts';

export const messages = (core: Core) => {
  const router = new Router();
  router.use('/messages', getAll(core));
  router.use('/messages', create(core));
  router.use('/messages', remove(core));
  router.use('/messages', update(core));
  return router;
}


