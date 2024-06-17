import RemoveSession from './session/remove.ts';
import CreateSession from './session/create.ts';
import GetSession from './session/get.ts';
import GetUser from './user/get.ts';
import { Command } from "./helpers.ts";
import { repo } from "../infra/mod.ts";


export class Core{
  commands = {
    RemoveSession,
    CreateSession,
  };

  session = {
    get: GetSession,
  }
  user = {
    get: GetUser,
  }

  constructor(public repository: typeof repo = repo) {};
  dispatch = async (evt: Command) => Object.values(this.commands).find(cmd => cmd.accepts(evt))?.(evt);
  close = async () => this.repository.close();
}

