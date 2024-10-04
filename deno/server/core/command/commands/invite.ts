import { randomBytes } from "node:crypto";
import type { Core } from "../../core.ts";
import { CommandBody } from "../params.ts";

export class InviteCommand {
  static commandName = "invite";

  static async execute(data: CommandBody, core: Core) {
    const { repo, bus, config } = core;
    const token = randomBytes(32).toString("hex");

    await repo.invitation.removeOutdated();
    await repo.invitation.create({
      token,
      userId: data.userId,
      channelId: data.context.channelId,
      expireAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
      createdAt: new Date(),
    });
    const link = `${config.baseUrl}/#/invite/${token}`;
    bus.direct(data.userId, {
      type: "message",
      userId: "system",
      priv: true,
      channelId: data.context.channelId,
      flat:
        `Invitation link (valid 5 days from now):\n${config.baseUrl}/#/invite/${token}`,
      message: [
        { line: { text: "Invitation link: " } },
        { line: { code: link } },
      ],
      createdAt: new Date().toISOString(),
    });

    return link;
  }
}
