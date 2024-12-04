import { buildRouter } from "@quack/storage";
import { Core } from "../../../../core/mod.ts";

export const files = (core: Core) => buildRouter(core.storage);
