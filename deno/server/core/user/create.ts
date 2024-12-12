import * as v from "valibot";
import { hash } from "@ts-rex/bcrypt";
import { createCommand } from "../command.ts";
import { InvalidInvitation, UserAlreadyExists } from "../errors.ts";

export default createCommand({
  type: "user:create",
  body: v.object({
    token: v.string(),
    name: v.string(),
    login: v.string(),
    password: v.string(),
  }),
}, async ({
  token,
  name,
  login,
  password,
}, { repo }) => {
  const invitation = await repo.invitation.get({ token });
  if (!invitation) {
    throw new InvalidInvitation();
  }

  const existing = await repo.user.get({ login });
  if (existing) throw new UserAlreadyExists();

  const userId = await repo.user.create({
    name,
    login,
    password: hash(password),
    mainChannelId: invitation.channelId,
  });

  await repo.channel.join({ id: invitation.channelId }, userId);
  await repo.invitation.remove({ id: invitation.id });

  return userId;
});
