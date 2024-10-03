import type { Core } from "../../core.ts";
import { randomBytes } from "node:crypto";
import { CommandBody } from "../params.ts";

export class InviteCommand {
  static commandName = "invite";

  static async execute(data: CommandBody, core: Core) {
    
    const { repo, bus, config } = core;
    const token = randomBytes(32).toString('hex');

    await repo.invitation.create({
      token,
      userId: data.userId,
      channelId: data.context.channelId,
      createdAt: new Date(),
    });
    const link = `${config.baseUrl}/#/invite/${token}`
    bus.direct(data.userId, {
      type: "message",
      userId: "system",
      priv: true,
      channelId: data.context.channelId,
      flat: `Invitation link:\n${config.baseUrl}/#/invite/${token}`,
      message: [
        { line: { text: 'Invitation link: ' } },
        { line: { code: link } },
      ],
      createdAt: new Date().toISOString(),
    });

    return link;
  }
}
