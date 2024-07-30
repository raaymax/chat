import { Router } from '@planigale/planigale';
import { Core } from "../../../../core/mod.ts";

import ping from './ping.ts'
import sse from './sse.ts'

export const system = (core: Core) => {
  const router = new Router();
  router.use(ping(core));
  router.use(sse(core));
  return router;
}


