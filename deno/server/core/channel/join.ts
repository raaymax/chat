import * as v from "valibot";
import { createCommand } from "../command.ts";
import { Id, IdArr } from "../types.ts";
import { usersExists } from "./validate.ts";
import { EntityId } from "../../types.ts";

export default createCommand({
  type: "channel:join",
  body: v.required(
    v.object({
      channelId: Id,
      userIds: IdArr,
    }),
    ["userIds"],
  ),
}, async (body, { repo, bus }) => {
  if(body.userIds.length === 0) return null;
  await usersExists(repo, body.userIds);

  const channel = await repo.channel.getR({id: body.channelId});
  const group = EntityId.unique([...channel.users, ...body.userIds]);
  await repo.channel.update({ id: channel.id }, { users: group });
  const c = await repo.channel.get({ id: body.channelId });

  bus.group(group, { type: "channel", ...c });

  return channel.id;
});
