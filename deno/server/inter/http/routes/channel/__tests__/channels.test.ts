import { assert, assertEquals } from "@std/assert";
import { Agent } from "@planigale/testing";
import { login } from "../../__tests__/mod.ts";
import { ObjectId } from "../../../../../infra/mod.ts";
import { Channel, ChannelType, EntityId } from "../../../../../types.ts";
import { createApp } from "../../__tests__/app.ts";
import { Chat } from "../../__tests__/chat.ts";
const { app, repo, core } = createApp();

Deno.test("/api/channels/* - unauthorized", async () => {
  const { app, repo, core } = createApp();
  const agent = await Agent.from(app);
  try {
    await agent.request().post("/api/channels").emptyBody().expect(401);
    await agent.request().get("/api/channels").expect(401);
    await agent.request().get("/api/channels/xyz").expect(401);
    await agent.request().delete("/api/channels/xyz").emptyBody().expect(401);
  } finally {
    await agent.close();
  }
});

Deno.test("/api/channels", async () => {
  return await Agent.test(app, { type: "handler" }, async (agent) => {
    return await Chat.init(repo, agent)
      .login("admin")
      .connectSSE()
      .createChannel({ name: "test" })
      .nextEvent((event: any) => {
        assertEquals(event.type, "channel");
        assertEquals(event.payload.name, "test");
      })
      .getChannel(async (channel: Channel) => {
        assertEquals(channel.name, "test");
        assertEquals(channel.private, false);
        assertEquals(channel.direct, false);
        assertEquals(channel.users.length, 1);
        assertEquals(channel.channelType, "PUBLIC");
      })
      .getChannels(async (channels: Channel[]) => {
        const channel = channels.find((c) => c.name === "test");
        assert(channel);
        assertEquals(channel.name, "test");
      })
      .removeChannel()
      .end();
  });
});

Deno.test("/api/channels - other user receives notification about channel", async () => {
  return await Agent.test(app, { type: "handler" }, async (agent) => {
    const member = Chat.init(repo, agent).login("member");
    const admin = Chat.init(repo, agent).login("admin");
    await member.connectSSE();
    if (member.userId === null) throw new Error("Couldn't login as member");
    await admin.createChannel({ name: "test", users: [member.userId] });
    await member
      .nextEvent((event: any) => {
        assertEquals(event.type, "channel");
        assertEquals(event.payload.name, "test");
      })
      .end();

    await member.end();
    await admin.end();
  });
});
