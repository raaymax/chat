import * as v from "valibot";
import { createCommand } from "../command.ts";
import { Id } from "../types.ts";

export default createCommand({
  type: "channel:remove",
  body: v.object({
    channelId: Id,
    userId: Id,
  }),
}, async ({ channelId, userId }, {repo}) => {
  await repo.channel.remove({ id: channelId, userId });
});
