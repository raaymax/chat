import * as v from "valibot";
import { createCommand } from "../command.ts";
import { Id, IdArr } from "../types.ts";
import { usersExists } from "./validate.ts";
import { EntityId } from "../../types.ts";

enum ChannelType {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE",
  DIRECT = "DIRECT",
}

export default createCommand({
  type: "channel:direct:put",
  body: v.required(
    v.object({
      userIds: IdArr,
    }),
    ["userIds"],
  ),
}, async (body, { repo }) => {
  const users = EntityId.unique(body.userIds);
  await usersExists(repo, users);

  const channel = await repo.channel.get({
    channelType: ChannelType.DIRECT,
    users,
    usersCount: users.length,
  })

  if(!channel) {
    return await repo.channel.create({
      channelType: ChannelType.DIRECT,
      users,
      private: true,
      direct: true,

    })
  }
  return channel.id;
});
