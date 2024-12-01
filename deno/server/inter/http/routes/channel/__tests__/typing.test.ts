import { assert, assertEquals } from "@std/assert";
import { Agent } from "@planigale/testing";
import { createApp } from "../../__tests__/app.ts";
import { Chat } from "../../__tests__/chat.ts";
import { ChannelType } from "../../../../../types.ts";

const { app, repo, core } = createApp();

Deno.test("/api/channels/:channelId/typing - in channel", async () => {
  await Agent.test(app, { type: "handler" }, async (agent) => {
    const member = Chat.init(repo, agent);
    const admin = Chat.init(repo, agent);

    try {
      await member.login("member")
      await admin.login("admin")

      await member
        .createChannel({ name: 'typing-tests', users: [member.userIdR, admin.userIdR] })
        .connectSSE();

      await admin
        .login("admin")
        .openChannel('typing-tests')
        .typing();

      await member
        .nextEvent((event, chat) => {
          assertEquals(event.type, "typing");
          assertEquals(event.userId, admin.userIdR);
        })
    } finally {
      await member.end();
      await admin.end();
    }
  });
});

