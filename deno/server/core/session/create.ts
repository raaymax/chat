import * as v from "valibot";
import { createCommand } from "../command.ts";
import { repo } from "../../infra/mod.ts";
import { hash, verify } from "@ts-rex/bcrypt";

export default createCommand({
  type: "session:create",
  body: v.object({
    login: v.string(),
    password: v.string(),
  }),
}, async ({ login, password }, core) => {
  const user = await repo.user.get({ login });
  if (!user) return null;
  if (!verify(password, user.password)) return null;

  const sessionId = await repo.session.create({ userId: user.id });
  return sessionId;
});
