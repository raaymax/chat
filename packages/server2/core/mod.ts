import { Command } from "./command.ts";
import * as commands from './commands.ts';
import { getSession } from "./session/get.ts";
import { getUser } from "./user/get.ts";
import { repo } from "../infra/mod.ts";

const core = {
  session: {
    get: getSession,
  },
  user: {
    get: getUser,
  },
  dispatch: async (evt: Command) => Object.values(commands).find(cmd => cmd.accepts(evt))?.(evt),
  close: async () => repo.close(),
};

export default core;
export type Core = typeof core;
