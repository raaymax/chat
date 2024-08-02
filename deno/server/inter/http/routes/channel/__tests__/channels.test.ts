import { assert, assertEquals } from "@std/assert";
import { Agent } from "@planigale/testing";
import app from "../../../mod.ts";
import { login } from "../../__tests__/helpers.ts";
import { repo } from "../../../../../infra/mod.ts";
import { ChannelType } from "../../../../../types.ts";

Deno.test("/api/channels/* - unauthorized", async () => {
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

Deno.test("/api/channels - create/get/getAll/delete channel", async () => {
  const agent = await Agent.from(app);
  const { token, userId } = await login(agent);
  try {
    const res = await agent.request()
      .post("/api/channels")
      .json({
        name: "test",
      })
      .header("Authorization", `Bearer ${token}`)
      .expect(200);

    const body = await res.json();
    const channelId = body.id;

    const { db } = await repo.connect();
    const channel = await db.collection("channels").findOne({
      _id: new repo.ObjectId(channelId),
    });
    assert(channel);
    assertEquals(channel.name, "test");
    assertEquals(channel.private, false);
    assertEquals(channel.direct, false);
    assertEquals(channel.users.map((u: repo.ObjectId) => u.toHexString()), [
      userId,
    ]);
    assertEquals(channel.channelType, "PUBLIC");

    const res2 = await agent.request()
      .get(`/api/channels/${channelId}`)
      .header("Authorization", `Bearer ${token}`)
      .expect(200);

    const body2 = await res2.json();
    assertEquals(body2.id, channelId);
    assertEquals(body2.name, "test");

    const res3 = await agent.request()
      .get("/api/channels")
      .header("Authorization", `Bearer ${token}`)
      .expect(200);
    const body3 = await res3.json();
    assert(Array.isArray(body3));
    assertEquals(
      body3.find(({ id }: { id: string }) => id === channelId).name,
      "test",
    );

    await agent.request()
      .delete(`/api/channels/${channelId}`)
      .emptyBody()
      .header("Authorization", `Bearer ${token}`)
      .expect(204);
  } finally {
    await agent.close();
  }
});

Deno.test("/api/channels - server sent events", async () => {
  const agent = await Agent.from(app);
  const { token } = await login(agent);
  const { token: memberToken, userId } = await login(agent, "member");
  await repo.channel.removeMany({
    name: "test",
    channelType: ChannelType.PUBLIC,
  });
  const events = agent.events("/api/sse", {
    headers: { Authorization: `Bearer ${memberToken}` },
  });
  try {
    {
      const { event } = await events.next();
      assertEquals(JSON.parse(event?.data ?? ""), { "status": "connected" });
    }
    const res = await agent.request()
      .post("/api/channels")
      .json({
        name: "test",
        users: [userId],
      })
      .header("Authorization", `Bearer ${token}`)
      .expect(200);

    const body = await res.json();

    const { event } = await events.next();
    await agent.request()
      .delete(`/api/channels/${body.id}`)
      .emptyBody()
      .header("Authorization", `Bearer ${token}`)
      .expect(204);

    const data = JSON.parse(event?.data ?? "");
    assertEquals(data.type, "channel");
    assertEquals(data.payload.name, "test");
  } finally {
    await events.close();
    await agent.close();
  }
});
