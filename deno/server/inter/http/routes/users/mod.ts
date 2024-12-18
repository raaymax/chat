import { Router } from "@planigale/planigale";
import { Core } from "../../../../core/mod.ts";

import getAllUsers from "./getAllUsers.ts";
import getUser from "./getUser.ts";
import create from "./create.ts";
import checkToken from "./checkToken.ts";

export const users = (core: Core) => {
  const router = new Router();
  router.use(getAllUsers(core));
  router.use(getUser(core));
  router.use(create(core));
  router.use(checkToken(core));
  return router;
};
