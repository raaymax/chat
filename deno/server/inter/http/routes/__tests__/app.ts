import { Config } from "@quack/config";
import { HttpInterface } from "../../mod.ts";
import { Core } from "../../../../core/mod.ts";
import { Repository } from "../../../../infra/mod.ts";

const __dirname = new URL(".", import.meta.url).pathname;
const config = await Config.from(__dirname + "/chat.config.ts");

export const createApp = () => {
  const repo = new Repository(config);
  const core = new Core({
    config,
    repo,
  });
  const http = new HttpInterface(core);

  http.onClose(async () => {
    await core.close();
  });

  return { app: http, repo, core };
};
