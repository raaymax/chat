import { assert, assertEquals } from "@std/assert";
import { Agent } from "@planigale/testing";
import { login , ensureUser} from "../../__tests__/mod.ts";

import config from '@quack/config';
import { createApp } from "../../__tests__/app.ts";
const { app, repo, core } = createApp();

Deno.env.set('APP_VERSION', '1.2.3');

Deno.test("GET /api/profile/config - unauthorized", async () => {
  const agent = await Agent.from(app);
  try {
    await agent.request().get("/api/profile/config").expect(401);
  } finally {
    await agent.close();
  }
});

Deno.test("GET /api/profile/config - getConfig", async () => {
  await Agent.test(app, {type: 'handler'}, async (agent) => {
    await ensureUser(repo, "admin", {name: "Admin", mainChannelId: "Test"});
    const {token} = await login(repo, agent, "admin");
    const res = await agent.request()
      .get("/api/profile/config")
      .header("Authorization", `Bearer ${token}`)
      .expect(200);
    const body = await res.json();
    assertEquals(body.appVersion, '1.2.3');
    assertEquals(body.mainChannelId, 'Test');
    assertEquals(body.vapidPublicKey, config.vapid.publicKey);
  }) 
})
