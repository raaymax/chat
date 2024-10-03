import { createCommand } from "../command.ts";
import { ResourceNotFound } from "../errors.ts";

import { EmojiCommand } from "./commands/emoji.ts";
import { VersionCommand } from "./commands/version.ts";
import { InviteCommand } from "./commands/invite.ts";
import { commandBodyValidator } from "./params.ts";

export default createCommand({
  type: "command:execute",
  body: commandBodyValidator,
}, async (msg, core) => {
  if (msg.name === "emoji") {
    return await EmojiCommand.execute(msg, core);
  }
  if (msg.name === "version") {
    return await VersionCommand.execute(msg, core);
  }
  if (msg.name === "invite") {
    return await InviteCommand.execute(msg, core);
  }
  if (msg.name === "echo") {
    const response = {
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

  throw new ResourceNotFound(`command not found`);
});
