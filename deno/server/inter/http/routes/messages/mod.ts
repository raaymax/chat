import { Router } from "@planigale/planigale";
import { Core } from "../../../../core/mod.ts";

import getAll from "./getAll.ts";
import get from "./get.ts";
import create from "./create.ts";
import remove from "./remove.ts";
import update from "./update.ts";
import pin from "./pin.ts";
import react from "./react.ts";

export const messages = (core: Core) => {
  const router = new Router();
  router.use(get(core));
  router.use(remove(core));
  router.use(update(core));
  router.use(pin(core));
  router.use(react(core));
  router.use("/:messageId", getAll(core));
  router.use("/:messageId", create(core));
  return router;
};

export const channelMessages = (core: Core) => {
  const router = new Router();
  router.use(getAll(core));
  router.use(create(core));
  return router;
};
