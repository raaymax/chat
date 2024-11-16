import * as v from "valibot";
import { createCommand } from "../command.ts";
import { Id, IdArr } from "../types.ts";

export default createCommand({
  type: "channel:user:typing",
  body: v.required(
    v.object({
      userId: Id,
      channelId: Id,
      parentId: v.optional(Id),
    }),
    ["userId", "channelId"],
  ),
}, async (body, core) => {
  const channel = await core.channel.access({
    id: body.channelId,
    userId: body.userId,
  }).internal();

  core.bus.group(channel.users, {
    type: "typing",
    userId: body.userId,
    channelId: body.channelId,
    parentId: body.parentId,
  }, body.userId);
});
