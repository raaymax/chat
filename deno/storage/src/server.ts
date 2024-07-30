import { buildApp } from "./interfaces/http/mod.ts";
import { initStorage } from "../../core/mod.ts";
import config from '@quack/config';

export const startServer = async () => {
  const app = await buildApp(initStorage(config));
  app.serve({ port: 8001, onListen: (addr) => {
    console.log(`[FILE SERVICE] Listening on http://${addr.hostname}:${addr.port}/`);
  }});
}
