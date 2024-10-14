import * as v from "valibot";
import { createCommand } from "../command.ts";
import { Id } from "../types.ts";

export default createCommand({
  type: "session:remove",
  body: v.object({
    sessionId: Id,
  }),
}, async ({ sessionId }, { repo }) => {
  await repo.session.remove({ id: sessionId });
});
