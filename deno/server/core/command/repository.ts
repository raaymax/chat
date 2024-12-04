import { EmojiCommand } from "./commands/emoji.ts";
import { VersionCommand } from "./commands/version.ts";
import { InviteCommand } from "./commands/invite.ts";
import { AvatarCommand } from "./commands/avatar.ts";
import { LeaveCommand } from "./commands/leave.ts";
import { JoinCommand } from "./commands/join.ts";
import { MainCommand } from "./commands/main.ts";

export type CommandType = {
  commandName: string;
  prompt: string;
  description: string;
  execute: (data: any, core: any) => Promise<any> | any;
};

export const commands: CommandType[] = [
  EmojiCommand,
  VersionCommand,
  InviteCommand,
  AvatarCommand,
  LeaveCommand,
  JoinCommand,
  MainCommand,
];

export const registerCommand = (command: CommandType) => {
  commands.push(command);
};
