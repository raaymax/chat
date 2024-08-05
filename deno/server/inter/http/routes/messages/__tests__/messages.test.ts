Deno.env.set("ENV_TYPE", "test");
import { Agent } from "@planigale/testing";
import app from "../../../mod.ts";
import { assert, assertEquals } from "@std/assert";
import { login, usingChannel } from "../../__tests__/mod.ts";
import { ObjectId } from "mongodb";
import { ChannelType, EntityId } from "../../../../../types.ts";
import { repo } from "../../../../../infra/mod.ts";

const randomChannelId = "66a35e599c8d540997b97808";

Deno.test("/api/channels/:channelId/messages - Authorization failed", async (t) => {
  await t.step(
    "POST /api/channels/:channelId/messages - should be authenticated",
    async () => {
      const res = await Agent.request(app)
        .post(`/api/channels/${randomChannelId}/messages`)
        .json({})
        .expect(401);
      const body = await res.json();
      assertEquals(body.errorCode, "ACCESS_DENIED");
    },
  );

  await t.step(
    "GET /api/channels/:channelId/messages/ - should be authenticated",
    async () => {
      const res = await Agent.request(app)
        .get(`/api/channels/${randomChannelId}/messages/`)
        .expect(401);
      const body = await res.json();
      assertEquals(body.errorCode, "ACCESS_DENIED");
    },
  );

  await t.step(
    "GET /api/messages/:messageId - should be authenticated",
    async () => {
      const res = await Agent.request(app)
        .get(`/api/messages/messageId`)
        .expect(401);
      const body = await res.json();
      assertEquals(body.errorCode, "ACCESS_DENIED");
    },
  );

  await t.step(
    "PATCH /api/messages/:messageId - should be authenticated",
    async () => {
      const res = await Agent.request(app)
        .patch(`/api/messages/messageId`)
        .json({})
        .expect(401);
      const body = await res.json();
      assertEquals(body.errorCode, "ACCESS_DENIED");
    },
  );

  await t.step(
    "DELETE /api/messages/:messageId - should be authenticated",
    async () => {
      const res = await Agent.request(app)
        .delete(`/api/messages/messageId`)
        .emptyBody()
        .expect(401);
      const body = await res.json();
      assertEquals(body.errorCode, "ACCESS_DENIED");
    },
  );
});

Deno.test("/api/channels/:channelId/messages - Auth successful", async (t) => {
  const agent = await Agent.from(app);
  const { token, userId } = await login(agent);
  await usingChannel({
    name: "test-messages",
    users: [EntityId.from(userId)],
    channelType: ChannelType.PUBLIC,
    private: false,
    direct: false,
    cid: "test-messages",
  }, async (channelId) => {
    let messageId: string;
    await t.step(
      "POST /api/channels/:channelId/messages - createMessage",
      async () => {
        const res = await agent.request()
          .post(`/api/channels/${channelId}/messages`)
          .json({
            message: {
              text: "test",
            },
            clientId: new ObjectId().toHexString(),
            flat: "test",
          })
          .header("Authorization", `Bearer ${token}`)
          .expect(200);
        const body = await res.json();
        assert(typeof body.id == "string");
      },
    );
    await t.step(
      "GET /api/channels/:channelId/messages - getAllMessages",
      async () => {
        const res = await agent.request()
          .get(`/api/channels/${channelId}/messages`)
          .header("Authorization", `Bearer ${token}`)
          .expect(200);
        const body = await res.json();
        assertEquals(body.length, 1);
        assertEquals(body[0].message.text, "test");
        messageId = body[0].id;
        const dbMeessage = await repo.message.get({ id: EntityId.from(messageId) });
        assertEquals(dbMeessage?.id, EntityId.from(messageId));
      },
    );
    await t.step(
      "GET /api/messages/:messageId - getMessage",
      async () => {
        const res = await agent.request()
          .get(`/api/messages/${messageId}`)
          .header("Authorization", `Bearer ${token}`)
          .expect(200);
        const body = await res.json();
        assertEquals(body.message.text, "test");
      },
    );
    await t.step(
      "DELETE /api/messages/:messageId - removeMessage",
      async () => {
        await agent.request()
          .delete(`/api/messages/${messageId}`)
          .emptyBody()
          .header("Authorization", `Bearer ${token}`)
          .expect(204);
        const body = await repo.message.get({ id: EntityId.from(messageId) });
        assertEquals(body, null);
      },
    );
  });
  await agent.close();
});

Deno.test("/api/channels/:channelId/messages - Access constraints", async (t) => {
  const agent = await Agent.from(app);
  const { token, userId } = await login(agent);
  const { token: memberToken, userId: memberUserId } = await login(agent, 'member');
  await usingChannel({
    name: "test-messages-access",
    users: [EntityId.from(userId), EntityId.from(memberUserId)],
    channelType: ChannelType.PUBLIC,
    private: false,
    direct: false,
    cid: "test-messages",
  }, async (channelId) => {
    let messageId: string;
    await t.step(
      "POST /api/channels/:channelId/messages - createMessage admin",
      async () => {
        const res = await agent.request()
          .post(`/api/channels/${channelId}/messages`)
          .json({
            message: {
              text: "test",
            },
            clientId: new ObjectId().toHexString(),
            flat: "test",
          })
          .header("Authorization", `Bearer ${token}`)
          .expect(200);
        const body = await res.json();
        assert(typeof body.id == "string");
      },
    );
    await t.step(
      "GET /api/channels/:channelId/messages - getAllMessages as member",
      async () => {
        const res = await agent.request()
          .get(`/api/channels/${channelId}/messages`)
          .header("Authorization", `Bearer ${memberToken}`)
          .expect(200);
        const body = await res.json();
        assertEquals(body.length, 1);
        assertEquals(body[0].message.text, "test");
        messageId = body[0].id;
        const dbMeessage = await repo.message.get({ id: EntityId.from(messageId) });
        assertEquals(dbMeessage?.id, EntityId.from(messageId));
      },
    );
    await t.step(
      "GET /api/messages/:messageId - getMessage as member",
      async () => {
        const res = await agent.request()
          .get(`/api/messages/${messageId}`)
          .header("Authorization", `Bearer ${memberToken}`)
          .expect(200);
        const body = await res.json();
        assertEquals(body.message.text, "test");
      },
    );
    await t.step(
      "DELETE /api/messages/:messageId - removeMessage as member - no access",
      async () => {
        const res = await agent.request()
          .delete(`/api/messages/${messageId}`)
          .emptyBody()
          .header("Authorization", `Bearer ${memberToken}`)
          .expect(403);
        const body = await res.json();
        assertEquals(body.errorCode, "NOT_OWNER");
      },
    );
  });
  await agent.close();
});

Deno.test("/api/channels/:channelId/messages - Sending to private channel", async (t) => {
  const agent = await Agent.from(app);
  const { token, userId } = await login(agent);
  const { token: memberToken, userId: memberUserId } = await login(agent, 'member');
  await usingChannel({
    name: "test-messages-access",
    users: [EntityId.from(userId)],
    channelType: ChannelType.PRIVATE,
    private: false,
    direct: false,
    cid: "test-messages",
  }, async (channelId) => {
    await t.step(
      "POST /api/channels/:channelId/messages - createMessage success if not memeber of private channel",
      async () => {
        const res = await agent.request()
          .post(`/api/channels/${channelId}/messages`)
          .json({
            message: {
              text: "test",
            },
            clientId: new ObjectId().toHexString(),
            flat: "test",
          })
          .header("Authorization", `Bearer ${token}`)
          .expect(200);
        const body = await res.json();
        assert(body.id);
      },
    );
    await t.step(
      "POST /api/channels/:channelId/messages - createMessage fail if not memeber of private channel",
      async () => {
        const res = await agent.request()
          .post(`/api/channels/${channelId}/messages`)
          .json({
            message: {
              text: "test",
            },
            clientId: new ObjectId().toHexString(),
            flat: "test",
          })
          .header("Authorization", `Bearer ${memberToken}`)
          .expect(404);
        const body = await res.json();
        assertEquals(body.errorCode, "RESOURCE_NOT_FOUND");
      },
    );
  });
  await agent.close();
});

Deno.test("Messages server sent events", async () => {
  const agent = await Agent.from(app);
  const { token, userId } = await login(agent);
  const { token: memberToken, userId: memberUserId } = await login(agent, "member");
  await usingChannel({
    name: "test-messages-access",
    users: [EntityId.from(userId), EntityId.from(memberUserId)],
    channelType: ChannelType.PUBLIC,
    private: false,
    direct: false,
    cid: "test-messages",
  }, async (channelId) => {
    const events = agent.events("/api/sse", {
      headers: { Authorization: `Bearer ${memberToken}` },
    });
    const { event } = await events.next();
    assertEquals(JSON.parse(event?.data ?? ""), { "status": "connected" });

    const res = await agent.request()
      .post(`/api/channels/${channelId}/messages`)
      .json({
        message: {
          text: "test",
        },
        clientId: new ObjectId().toHexString(),
        flat: "test",
      })
      .header("Authorization", `Bearer ${token}`)
      .expect(200);

    const body = await res.json();
    const { event: messageEvent } = await events.next();
    assertEquals(JSON.parse(messageEvent?.data ?? "").id, body.id);
    await events.close();
  });
  await agent.close();
});
