import {HttpInterface} from "../../mod.ts";
import {Core}from "../../../../core/mod.ts";

export const createApp = () => {
  const core = new Core();
  const http = new HttpInterface(core);

  http.onClose(async () => {
    await core.close();
  });

  return {app: http, repo: core.repo, core};
}

