import { Agent } from "@planigale/testing";
import { assertEquals } from "@std/assert";
import { createApp } from "../../__tests__/app.ts";
import { Chat } from "../../__tests__/chat.ts";
import { MessageInteractionEvent } from "../../../../../events.ts";
import { EntityId } from "../../../../../types.ts";

const { app, repo, core } = createApp();

Deno.test("POST /api/interactions - dispatching interactions", async (t) => {
  await Agent.test(app, { type: "handler" }, async (agent) => {
    const admin = Chat.init(repo, agent);
    try {
      await admin
        .login("admin")
        .createChannel({ name: "test-messages-interactions" });
      const { promise, resolve, reject } = Promise.withResolvers<void>();
      (async () => {
        const { done, event } = await core.events.next();
        if (done || event.type !== "message:interaction") {
          return reject(new Error("Wrong event type"));
        }
        const interaction = event.payload;
        assertEquals(interaction.userId, EntityId.from(admin.userIdR));
        assertEquals(interaction.channelId, EntityId.from(admin.channelIdR));
        assertEquals(interaction.parentId, undefined);
        assertEquals(interaction.clientId, "clientId");
        assertEquals(interaction.action, "test");
        assertEquals(interaction.payload, { test: "test" });
      })().then(resolve, reject);
      await admin
        .interaction({
          action: "test",
          clientId: "clientId",
          payload: { test: "test" },
        });

      await promise;
    } finally {
      await admin.end();
    }
  });
});

Deno.test("POST /api/interactions - graceful shutdown", async (t) => {
  const { promise, resolve, reject } = Promise.withResolvers<void>();
  await Agent.test(app, { type: "handler" }, async (agent) => {
    const admin = Chat.init(repo, agent);
    try {
      await admin
        .login("admin")
        .createChannel({ name: "test-messages-interactions" });
      const listener = async () => {
        for await (const int of core.events) {
          // do nothing
        }
        resolve();
      };
      listener();
      await admin
        .interaction({ action: "test", clientId: "clientId" })
        .interaction({ action: "test", clientId: "clientId" })
        .interaction({ action: "test", clientId: "clientId" })
        .interaction({ action: "test", clientId: "clientId" })
        .interaction({ action: "test", clientId: "clientId" })
        .interaction({ action: "test", clientId: "clientId" });
    } finally {
      await admin.end();
    }
  });
  await promise;
});
