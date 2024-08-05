import { assert, assertEquals } from "@std/assert";
import { Agent } from "@planigale/testing";
import app from "../../../mod.ts";
import { login, ensureUser } from "../../__tests__/mod.ts";
import { User } from "../../../../../types.ts";

Deno.test("GET /api/channels - unauthorized", async () => {
  const agent = await Agent.from(app);
  try {
    await agent.request().get("/api/users").expect(401);
  } finally {
    await agent.close();
  }
});



Deno.test("GET /api/users - getAllUsers", async () => {
  await ensureUser("admin", {name: "Admin"});
  await ensureUser("member", {name: "Member"});
  await Agent.test(app, {type: 'handler'}, async (agent) => {
    const {token} = await login(agent, "admin");
    const res = await agent.request()
      .get("/api/users")
      .header("Authorization", `Bearer ${token}`)
      .expect(200);
    const body = await res.json();
    assertEquals(body.length, 2);
    assertEquals(body.map((u: User) => u.name).sort(), ["Admin", "Member"].sort());
    assert(body[0].password === undefined);
    assert(body[1].password === undefined);
  }) 
})
