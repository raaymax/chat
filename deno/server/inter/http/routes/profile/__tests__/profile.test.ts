import { assert, assertEquals } from "@std/assert";
import { Agent } from "@planigale/testing";
import { ensureUser, login } from "../../__tests__/mod.ts";

import config from "@quack/config";
import { createApp } from "../../__tests__/app.ts";
import { Chat } from "../../__tests__/chat.ts";
const { app, repo, core } = createApp();

Deno.env.set("APP_VERSION", "1.2.3");

Deno.test("GET /api/profile/config - unauthorized", async () => {
  const agent = await Agent.from(app);
  try {
    await agent.request().get("/api/profile/config").expect(401);
  } finally {
    await agent.close();
  }
});

Deno.test("GET /api/profile/config - getConfig", async () => {
  await Agent.test(app, { type: "handler" }, async (agent) => {
    await Chat.init(repo, agent)
      .login("admin")
      .getConfig(async (body: any) => {
        assertEquals(body.appVersion, "1.2.3");
        assertEquals(body.mainChannelId, "Test");
        assertEquals(body.vapidPublicKey, config.vapid.publicKey);
      })
      .end();
  });
});
