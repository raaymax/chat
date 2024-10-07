import * as v from "valibot";
import { createCommand } from "../command.ts";
import { Id, IdArr } from "../types.ts";
import { InvalidChannelValue } from "../errors.ts";
import { usersExists } from "./validate.ts";
import { ChannelType } from "../../types.ts";

export default createCommand({
  type: "channel:create",
  body: v.required(
    v.object({
      userId: Id,
      channelType: v.optional(v.enum_(ChannelType), ChannelType.PUBLIC),
      name: v.string(),
      users: v.optional(IdArr, []),
    }),
    ["userId", "name"],
  ),
}, async (channel, { repo, bus }) => {
  await usersExists(repo, channel.users);
  if (channel.channelType === ChannelType.DIRECT) {
    throw new InvalidChannelValue("Direct channel can't be created this way");
  }
  const {
    channelType,
    userId,
    users,
    name,
  } = channel;
  const existing = await repo.channel.get({ channelType, name, userId });
  if (existing) {
    return existing.id;
  }

  const channelId = await repo.channel.create({
    name,
    channelType,
    private: channelType === "PRIVATE",
    direct: false,
    users: [userId, ...users],
  });

  const created = await repo.channel.get({ id: channelId });

  bus.group(created?.users ?? [], {
    type: "channel",
    payload: created,
  });

  return channelId;
});
