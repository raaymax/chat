import * as v from "valibot";
import { createCommand } from "../command.ts";
import { Id, IdArr } from "../types.ts";
import { bus } from "../bus.ts";
import { ResourceNotFound } from "../errors.ts";
import { Message } from "../../types.ts";

import { EmojiCommand } from "./commands/emoji.ts";
import { VersionCommand } from "./commands/version.ts";

export default createCommand({
  type: "command:execute",
  body: v.required(
    v.object({
      userId: Id,
      name: v.string(),
      text: v.string(),
      attachments: v.optional(
        v.array(v.object({
          id: v.string(),
          fileName: v.string(),
          contentType: v.optional(v.string(), "application/octet-stream"),
        })),
        [],
      ),
      context: v.object({
        channelId: Id,
      }),
    }),
    ["name", "text", "context"],
  ),
}, async (msg, core) => {
  if(msg.name === "emoji") {
    return await EmojiCommand.execute(msg, core);
  }
  if(msg.name === "version") {
    return await VersionCommand.execute(msg, core);
  }
  if(msg.name === "echo") {
    const response = {
      channelId: msg.context.channelId,
      flat: msg.text,
      message: { text: msg.text },
      createdAt: new Date().toISOString(),
    }

    bus.direct(msg.userId, {
      type: "message",
      ...response,
    })
    return;
  }

  throw new ResourceNotFound(`command not found`);
});
