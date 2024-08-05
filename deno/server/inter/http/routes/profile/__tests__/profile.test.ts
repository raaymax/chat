import { assert, assertEquals } from "@std/assert";
import { Agent } from "@planigale/testing";
import app from "../../../mod.ts";
import { login , ensureUser} from "../../__tests__/mod.ts";

import { User } from "../../../../../types.ts";
import config from '@quack/config';
import pack from "../../../../../../../package.json" with { type: "json" };

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
    await ensureUser("admin", {name: "Admin", mainChannelId: "Test"});
    const {token} = await login(agent, "admin");
    const res = await agent.request()
      .get("/api/profile/config")
      .header("Authorization", `Bearer ${token}`)
      .expect(200);
    const body = await res.json();
    assertEquals(body.appVersion, pack.version);
    assertEquals(body.mainChannelId, 'Test');
    assertEquals(body.vapidPublicKey, config.vapid.publicKey);
  }) 
})
