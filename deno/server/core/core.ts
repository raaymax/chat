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
import GetAllMessages from "./message/getAll.ts";
import GetMessage from "./message/get.ts";
import RemoveMessage from "./message/remove.ts";
import UpdateMessage from "./message/update.ts";
import GetAllEmojis from "./emoji/getAll.ts";
import CommandExecute from "./command/execute.ts";
import GetAllReadReceipts from "./readReceipt/getAll.ts";
import GetChannelReadReceipts from "./readReceipt/getChannel.ts";
import UpdateReadReceipt from "./readReceipt/updateReadReceipt.ts";
import { Repository, storage } from "../infra/mod.ts";
import { buildCommandCollection, EventFrom } from "./command.ts";
import { bus } from "./bus.ts";
import { Config } from "@quack/config";
import BadgesService from "./badgesService.ts";

const commands = buildCommandCollection([
  CreateMessage,
  RemoveSession,
  CreateSession,
  CreateChannel,
  RemoveChannel,
  UpdateMessage,
  CommandExecute,
  UpdateReadReceipt,
]);

export class Core {
  storage: storage.Storage;
  repo: Repository;

  channel = {
    get: GetChannel(this),
    getAll: GetAllChannels(this),
  };

  session = {
    get: GetSession(this),
  };

  user = {
    get: GetUser(this),
    getAll: GetAllUsers(this),
    getConfig: GetUserConfig(this),
  };

  message = {
    getAll: GetAllMessages(this),
    get: GetMessage(this),
    remove: RemoveMessage(this),
  };

  emoji = {
    getAll: GetAllEmojis(this),
  };

  readReceipt = {
    getAll: GetAllReadReceipts(this),
    getChannel: GetChannelReadReceipts(this),
  };

  services = {
    badge: new BadgesService(this),
  };

  constructor(arg: {
    config: Config;
    repo?: Repository;
    fileStorage?: storage.Storage;
  }) {
    this.repo = arg.repo ?? new Repository(arg.config);
    this.storage = arg.fileStorage ?? storage.initStorage(arg.config);
  }
  dispatch = async (evt: EventFrom<typeof commands[keyof typeof commands]>) => {
    // deno-lint-ignore no-explicit-any
    return await (commands[evt.type] as any).handler(evt.body, this);
  };

  bus = bus;

  close = async () => await this.repo.close();
}
