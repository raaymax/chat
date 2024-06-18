import RemoveSession from './session/remove.ts';
import CreateSession from './session/create.ts';
import CreateChannel from './channel/create.ts';
import RemoveChannel from './channel/remove.ts';
import GetSession from './session/get.ts';
import GetUser from './user/get.ts';
import GetChannel from './channel/get.ts';
import { Command } from "./helpers.ts";
import { repo } from "../infra/mod.ts";


export class Core{
  commands = {
    RemoveSession,
    CreateSession,
    CreateChannel,
    RemoveChannel,
  };
  
  channel = {
    get: GetChannel,
  }

  session = {
    get: GetSession,
  }

  user = {
    get: GetUser,
  }

  constructor(public repository: typeof repo = repo) {};
  dispatch = async (evt: Command) => {
    const cmd = Object.values(this.commands).find(cmd => cmd.accepts(evt));
    if(!cmd) throw new Error(`Command not found for ${evt.type}`);
    return await cmd(evt);
  };
  close = async () => this.repository.disconnect();
}

