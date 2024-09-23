import { assert, assertEquals } from "@std/assert";
import { Agent } from "@planigale/testing";
import { login, ensureUser } from "../../__tests__/mod.ts";
import { Emoji } from "../../../../../types.ts";
import { createApp } from "../../__tests__/app.ts";
import { Chat } from "../../__tests__/chat.ts";
const { app, repo, core } = createApp();

Deno.test("GET /api/emojis - unauthorized", async () => {
  const agent = await Agent.from(app);
  try {
    await agent.request().get("/api/emojis").expect(401);
  } finally {
    await agent.close();
  }
});

Deno.test("GET /api/emojis - getAllEmojis empty list", async () => {
  await Agent.test(app, {type: 'handler'}, async (agent) => {
    await Chat.init(repo, agent)
      .login("member")
      .getEmojis(async (emojis: Emoji[]) => {
        assertEquals(emojis, []);
      })
      .end();
  })
})
