import { Router } from "@planigale/planigale";
import { Core } from "../../../../core/mod.ts";

import post from "./post.ts";

export const interactions = (core: Core) => {
  const router = new Router();
  router.use(post(core));
  return router;
};

