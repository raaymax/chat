import { Planigale, Router } from '@planigale/planigale';
import { SchemaValidator } from '@planigale/schema';
import * as routes from "./routes/mod.ts";
import type { Storage } from '../../core/mod.ts';

export const buildRouter = async (storage: Storage, prefix = '') => {
  const router = new Router();
  for (const route of Object.values(routes)) {
    router.use(prefix, await route(storage));
  }
  return router;
}

export const buildApp = async (storage: Storage) => {
  const app = new Planigale();
  const schemaValidator = new SchemaValidator();
  app.use(schemaValidator.middleware);
  app.use(await buildRouter(storage));
  return app;
}

