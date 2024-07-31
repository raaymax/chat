Deno.env.set("ENV_TYPE", "test");
import { Agent } from "@planigale/testing";
import app from "../../../mod.ts";
import { assert, assertEquals } from "@std/assert";
import { login } from "../../__tests__/helpers.ts";
import { ObjectId } from "mongodb";
import { usingChannel } from "./usingChannel.ts";
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
    "PATCH /api/channels/:channelId/messages/:messageId - should be authenticated",
    async () => {
      const res = await Agent.request(app)
        .patch(`/api/channels/${randomChannelId}/messages/messageId`)
        .json({})
        .expect(401);
      const body = await res.json();
      assertEquals(body.errorCode, "ACCESS_DENIED");
    },
  );

  await t.step(
    "DELETE /api/channels/:channelId/messages/:messageId - should be authenticated",
    async () => {
      const res = await Agent.request(app)
        .delete(`/api/channels/${randomChannelId}/messages/messageId`)
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
    await t.step(
      "POST /api/channels/:channelId/messages - create",
      async () => {
        const res = await agent.request()
          .post(`/api/channels/${channelId}/messages/`)
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
  });
  await agent.close();
});
