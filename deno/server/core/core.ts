import config from "@quack/config";
import RemoveSession from "./session/remove.ts";
import CreateSession from "./session/create.ts";
import CreateChannel from "./channel/create.ts";
import RemoveChannel from "./channel/remove.ts";
import GetSession from "./session/get.ts";
import GetUser from "./user/get.ts";
import GetChannel from "./channel/get.ts";
import GetAllChannels from "./channel/getAll.ts";
import CreateMessage from "./message/create.ts";
import GetUserConfig from "./user/getConfig.ts";
import GetAllUsers from "./user/getAll.ts";
import { repo, storage } from "../infra/mod.ts";
import { buildCommandCollection, EventFrom } from "./command.ts";
import { bus } from "./bus.ts";

const commands = buildCommandCollection([
  CreateMessage,
  RemoveSession,
  CreateSession,
  CreateChannel,
  RemoveChannel,
]);

export class Core {
  storage = storage.initStorage(config);

  channel = {
    get: GetChannel,
    getAll: GetAllChannels,
  };

  session = {
    get: GetSession,
  };

  user = {
    get: GetUser,
    getAll: GetAllUsers,
    getConfig: GetUserConfig,
  };

  constructor(public repository: typeof repo = repo) {}
  dispatch = async (evt: EventFrom<typeof commands[keyof typeof commands]>) => {
    // deno-lint-ignore no-explicit-any
    return await (commands[evt.type] as any).handler(evt.body);
  };

  bus = bus;

  close = async () => this.repository.disconnect();
}
