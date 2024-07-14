import app from "./inter/http/mod.ts"
import core from "../core/mod.ts";

const srv = await app.serve({port: 8000});
srv.finished.then(async () => {
  await core.close();
});

