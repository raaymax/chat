import { createCommand } from "../command.ts";
import { ResourceNotFound } from "../errors.ts";

import { EmojiCommand } from "./commands/emoji.ts";
import { VersionCommand } from "./commands/version.ts";
import { InviteCommand } from "./commands/invite.ts";
import { AvatarCommand } from "./commands/avatar.ts";
import { LeaveCommand } from "./commands/leave.ts";
import { JoinCommand } from "./commands/join.ts";
import { commandBodyValidator } from "./params.ts";

const commands = [
  EmojiCommand,
  VersionCommand,
  InviteCommand,
  AvatarCommand,
  LeaveCommand,
  JoinCommand,
];

export default createCommand({
  type: "command:execute",
  body: commandBodyValidator,
}, async (msg, core) => {
  const command = commands.find((command) => command.commandName === msg.name);
  if (command) {
    return await command.execute(msg, core);
  }
  if (msg.name === "echo") {
    const response = {
      id: `sys:${Math.random().toString(10)}`,
      channelId: msg.context.channelId,
      flat: msg.text,
      message: { text: msg.text },
      createdAt: new Date().toISOString(),
    };

    core.bus.direct(msg.userId, {
      type: "message",
      ...response,
    });
    return;
  }

  if (msg.name === "help") {
    core.bus.direct(msg.userId, {
      type: "message",
      id: `sys:${Math.random().toString(10)}`,
      channelId: msg.context.channelId,
      flat: `Available commands: ${
        commands.map((command) => "/" + command.commandName).join(", ")
      }`,
      message: [
        { line: `Available commands:` },
        {
          bullet: [
            ...commands.map((command) => ({
              item: [
                { code: "/" + command.commandName +( command.prompt ? " " + command.prompt : "" )},
                { text: " - " },
                { text: command.description },
              ],
            })),
          ],
        },
      ],
      createdAt: new Date().toISOString(),
    });
    return;
  }

  throw new ResourceNotFound("command not found");
});
