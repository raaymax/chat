import { assert, assertEquals } from "@std/assert";
import { Agent } from "@planigale/testing";
import { login, ensureUser } from "../../__tests__/mod.ts";
import { User } from "../../../../../types.ts";
import { createApp } from "../../__tests__/app.ts";
import { Chat } from "../../__tests__/chat.ts";
const { app, repo, core } = createApp();

Deno.test("GET /api/channels - unauthorized", async () => {
  const agent = await Agent.from(app);
  try {
    await agent.request().get("/api/users").expect(401);
  } finally {
    await agent.close();
  }
});

Deno.test("GET /api/users - getAllUsers", async () => {
  await ensureUser(repo, "admin", {name: "Admin"});
  await ensureUser(repo, "member", {name: "Member"});
  await Agent.test(app, {type: 'handler'}, async (agent) => {
    await Chat.init(repo, agent)
      .login("admin")
      .getUsers(async (users: User[]) => {
        const userNames = users.map((u: User) => u.name);
        assert(userNames.includes("Admin"));
        assert(userNames.includes("Member"));
        assert(users[0].password === undefined);
        assert(users[1].password === undefined);
      })
      .end();
  }) 
})
