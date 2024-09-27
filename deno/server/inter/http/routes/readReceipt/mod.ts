import { Router } from "@planigale/planigale";
import { Core } from "../../../../core/mod.ts";

import getChannel from "./getChannel.ts";
import getAll from "./getAll.ts";
import put from "./put.ts";

export const readReceipt = (core: Core) => {
  const router = new Router();
  router.use(getChannel(core));
  router.use(getAll(core));
  router.use(put(core));
  return router;
};
