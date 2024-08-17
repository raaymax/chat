import { HttpInterface } from "./inter/http/mod.ts";
import { Core } from "./core/mod.ts";
import config from "@quack/config";

const core = new Core({
  config,
});
const http = new HttpInterface(core);

http.onClose(async () => {
  await core.close();
});

export default http;
