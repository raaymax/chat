import { Router } from "@planigale/planigale";
import { Core } from "../../../../core/mod.ts";

import getChannel from "./getChannel.ts";
import getAllChannels from "./getAllChannels.ts";
import postChannel from "./postChannel.ts";
import deleteChannel from "./deleteChannel.ts";
import putDirect from "./putDirect.ts";
import getDirect from "./getDirect.ts"

export const channels = (core: Core) => {
  const router = new Router();
  router.use(getChannel(core));
  router.use(getAllChannels(core));
  router.use(postChannel(core));
  router.use(deleteChannel(core));
  router.use(putDirect(core));
  router.use(getDirect(core));
  return router;
};
