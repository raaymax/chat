import { Router } from "@planigale/planigale";
import { Core } from "../../../../core/mod.ts";

import getAllUsers from "./getAllUsers.ts";

export const users = (core: Core) => {
  const router = new Router();
  router.use(getAllUsers(core));
  return router;
};
