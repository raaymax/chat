import { Config } from "@quack/config";
import { files as fs } from "./fs.ts";
import { files as gcs } from "./gcs.ts";
import { files as memory } from "./memory.ts";

export const files = (config: Config["storage"]) => {
  if (config.type === "fs") {
    return fs(config);
  } else if (config.type === "gcs") {
    return gcs(config);
  } else if (config.type === "memory") {
    return memory(config);
  } else {
    throw new Error("Unknown storage type");
  }
};
