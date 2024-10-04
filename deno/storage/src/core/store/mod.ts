import type { Config } from "@quack/config";
import { files as fs } from "./fs.ts";
import { files as gcs } from "./gcs.ts";
import { files as memory } from "./memory.ts";

export const files = (config: Config["storage"]) => {
  if (config.type === "fs") {
    return fs(config);
  }
  if (config.type === "gcs") {
    return gcs(config);
  }
  if (config.type === "memory") {
    return memory(config);
  }
  throw new Error("Unknown storage type");
};
