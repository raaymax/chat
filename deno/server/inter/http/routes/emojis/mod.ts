import { Router } from "@planigale/planigale";
import { Core } from "../../../../core/mod.ts";

import getAllEmojis from "./getAllEmojis.ts";

export const emojis = (core: Core) => {
  const router = new Router();
  router.use(getAllEmojis(core));
  return router;
};
