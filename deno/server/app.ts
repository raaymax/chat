import app from "./inter/http/mod.ts";
import core from "./core/mod.ts";

const srv = await app.serve({
  port: 8008,
  onListen: (addr: Deno.NetAddr) => {
    console.log(
      `[QUACK API] Listening on http://${addr.hostname}:${addr.port}/`,
    );
  },
});

app.onClose(async () => {
  await core.close();
});
