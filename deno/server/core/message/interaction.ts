import * as v from "valibot";
import { createCommand } from "../command.ts";
import { Id } from "../types.ts";

export default createCommand({
  type: "message:interaction",
  body: v.object({
    userId: Id,
    channelId: Id,
    parentId: v.optional(Id),
    clientId: v.string(),
    appId: v.optional(v.string()),
    action: v.string(),
    payload: v.optional(v.any()),
  }),
}, async (payload, core) => {
  await core.events.dispatch({
    type: "message:interaction",
    payload,
  });
});
