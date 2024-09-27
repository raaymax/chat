import { Router } from "@planigale/planigale";
import { Core } from "../../../../core/mod.ts";

import getChannel from "./getChannel.ts";
import getAll from "./getAll.ts";
import post from "./post.ts";

export const readReceipt = (core: Core) => {
  const router = new Router();
  router.use(getChannel(core));
  router.use(getAll(core));
  router.use(post(core));
  return router;
};
