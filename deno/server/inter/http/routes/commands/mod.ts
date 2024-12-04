import { Router } from "@planigale/planigale";
import { Core } from "../../../../core/mod.ts";

import execute from "./execute.ts";

export const commands = (core: Core) => {
  const router = new Router();
  router.use(execute(core));
  return router;
};
