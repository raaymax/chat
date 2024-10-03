import * as v from "valibot";
import { createCommand } from "../command.ts";
import bcrypt from "npm:bcrypt";

export default createCommand({
  type: "user:create",
  body: v.object({
    token: v.string(),
    name: v.string(),
    login: v.string(),
    password: v.string(),
  }),
}, async ({token, name, login, password }, { repo, dispatch }) => {
   const invitation = await repo.invitation.get({ token });
    if (!invitation) {
      throw new Error('Invalid invitation token');
    }

    const existing = await repo.user.get({ login });
    if (existing) throw new Error('Login already exists');

    const userId = await repo.user.create({
      name,
      login,
      password: bcrypt.hashSync(password, 10),
      mainChannelId: invitation.channelId,
    });
  
    await repo.channel.join({id: invitation.channelId }, userId);

    return userId;
});
