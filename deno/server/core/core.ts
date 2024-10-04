import { Config } from "@quack/config";
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
import PinMessage from "./message/pin.ts";
import GetAllEmojis from "./emoji/getAll.ts";
import CommandExecute from "./command/execute.ts";
import GetAllReadReceipts from "./readReceipt/getAll.ts";
import GetChannelReadReceipts from "./readReceipt/getChannel.ts";
import UpdateReadReceipt from "./readReceipt/updateReadReceipt.ts";
import ReactToMessage from "./message/react.ts";
import CreateUser from "./user/create.ts";
import { Repository, storage } from "../infra/mod.ts";
import { buildCommandCollection, EventFrom } from "./command.ts";
import { Bus } from "./bus.ts";
import BadgesService from "./badgesService.ts";
import { Webhooks } from "./webhooks.ts";

const commands = buildCommandCollection([
  CreateMessage,
  RemoveSession,
  CreateSession,
  CreateChannel,
  RemoveChannel,
  UpdateMessage,
  CommandExecute,
  UpdateReadReceipt,
  PinMessage,
  RemoveMessage,
  CreateUser,
  ReactToMessage,
]);

export class Core {
  bus: Bus;

  storage: storage.Storage;

  repo: Repository;

  config: Config;

  webhooks?: Webhooks;

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
    this.config = arg.config;
    this.bus = new Bus();
    this.repo = arg.repo ?? new Repository(arg.config);
    this.storage = arg.fileStorage ?? storage.initStorage(arg.config);

    if (arg.config.webhooks) {
      this.webhooks = new Webhooks(this, arg.config);
    }
  }

  dispatch = async (evt: EventFrom<typeof commands[keyof typeof commands]>) =>
    // deno-lint-ignore no-explicit-any
    await (commands[evt.type] as any).handler(evt.body, this);

  close = async () => await this.repo.close();
}
