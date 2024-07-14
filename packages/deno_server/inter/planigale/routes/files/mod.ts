import { Router } from '@codecat/planigale';
import { Core } from "../../../../core/mod.ts";
//import { initStorage } from '@quack/storage';
//import config from '@quack/config';

import downloadFile from './downloadFile.ts'
import uploadFile from './uploadFile.ts'

export const files = (core: Core) => {
  //const storage = initStorage(config);
  const router = new Router();
  router.use('/files', downloadFile(core));
  router.use('/files', uploadFile(core));
  return router;
}

