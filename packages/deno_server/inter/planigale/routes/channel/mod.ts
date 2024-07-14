import { Router } from '@codecat/planigale';
import { Core } from "../../../../core/mod.ts";

import getChannel from './getChannel.ts'
import getAllChannels from './getAllChannels.ts'
import postChannel from './postChannel.ts'
import deleteChannel from './deleteChannel.ts'

export const channels = (core: Core) => {
  const router = new Router();
  router.use(getChannel(core));
  router.use(getAllChannels(core));
  router.use(postChannel(core));
  router.use(deleteChannel(core));
  return router;
}

