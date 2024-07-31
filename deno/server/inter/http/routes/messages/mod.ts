import { Router } from "@planigale/planigale";
import { Core } from "../../../../core/mod.ts";

import getAll from "./getAll.ts";
import create from "./create.ts";
import remove from "./remove.ts";
import update from "./update.ts";

export const messages = (core: Core) => {
  const router = new Router();
  router.use(getAll(core));
  router.use(create(core));
  router.use(remove(core));
  router.use(update(core));
  return router;
};
