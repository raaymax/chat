import * as v from "valibot";
import { createQuery } from "../query.ts";

export default createQuery({
  type: "user:token:check",
  body: v.object({
    token: v.string(),
  }),
}, async (query, { repo }) => {
  const invitation = await repo.invitation.get({ token: query.token });
  if (!invitation) {
    return false;
  }
  return true;
});
