import { Core } from "../../../../core/mod.ts";
import { buildRouter } from '@quack/storage';

export const files = (core: Core) => {
  return buildRouter(core.storage, '/files');
}

