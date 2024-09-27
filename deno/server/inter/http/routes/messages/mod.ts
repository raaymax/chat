import { Router } from "@planigale/planigale";
import { Core } from "../../../../core/mod.ts";

import getAll from "./getAll.ts";
import get from "./get.ts";
import create from "./create.ts";
import remove from "./remove.ts";
import update from "./update.ts";
import pin from "./pin.ts";

export const messages = (core: Core) => {
  const router = new Router();
  router.use("/channels/:channelId/messages", getAll(core));
  router.use("/channels/:channelId/messages", create(core));
  router.use("/messages", get(core));
  router.use("/messages", remove(core));
  router.use("/messages", update(core));
  router.use("/messages", pin(core));
  return router;
};
