import { Router } from "@planigale/planigale";
import { Core } from "../../../../core/mod.ts";

import config from "./config.ts";

export const profile = (core: Core) => {
  const router = new Router();
  router.use(config(core));
  return router;
};
