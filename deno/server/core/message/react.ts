import * as v from "valibot";
import { createCommand } from "../command.ts";
import { Id } from "../types.ts";
import { InvalidMessage } from "../errors.ts";

export default createCommand({
  type: "message:react",
  body: v.object({
    id: Id,
    userId: Id,
    reaction: v.string(),
  }),
}, async (body, core) => {
  const { repo, bus } = core;
  const { id } = body;
  const message = await repo.message.get({ id });
  if (!message) throw new InvalidMessage();
  await core.channel.access({ id: message.channelId, userId: body.userId })
    .internal();

  message.reactions = message.reactions || [];

  const idx = message.reactions
    .findIndex((r) => r.userId.eq(body.userId) && r.reaction === body.reaction);
  if (idx === -1) {
    message.reactions.push({
      userId: body.userId,
      reaction: body.reaction,
    });
  } else {
    message.reactions = [
      ...message.reactions.slice(0, idx),
      ...message.reactions.slice(idx + 1),
    ];
  }

  await repo.message.update({ id }, { reactions: message.reactions });
  const channel = await repo.channel.get({ id: message.channelId });
  if (!channel) throw new InvalidMessage("Message channel not found");
  bus.group(channel.users, {
    type: "message",
    ...message,
  });
});
