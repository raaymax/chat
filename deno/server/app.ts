import app from "./inter/http/mod.ts";
import core from "./core/mod.ts";
import { files } from "./infra/mod.ts";

const srv = await app.serve({
  port: 8000,
  onListen: (addr: Deno.NetAddr) => {
    console.log(
      `[QUACK API] Listening on http://${addr.hostname}:${addr.port}/`,
    );
    files.start();
  },
});
app.onClose(async () => {
  await core.close();
  await files.close();
});
