import { assert, assertEquals } from "@std/assert";
import { Agent } from "@planigale/testing";
import { login } from "../../__tests__/mod.ts";
import { createApp } from "../../__tests__/app.ts";

const { app, repo, core } = createApp();

Deno.test("GET /api/sse - unauthorized", async () => {
  const request = new Request("http://localhost/api/sse");
  const res = await app.handle(request);
  assertEquals(res.status, 401);
  const body = await res.json();
  assertEquals(body.errorCode, "ACCESS_DENIED");
});

Deno.test("/api/sse - auth", async () => {
  await Agent.server(app, async (agent) => {
    const { token } = await login(repo, agent);
    const source = agent.events("/api/sse", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    try {
      const { event } = await source.next();
      assert(event);
      await source.close();
    } catch (e) {
      console.log(e);
    }
  });
});
