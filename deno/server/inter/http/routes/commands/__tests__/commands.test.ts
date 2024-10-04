import { assert, assertEquals } from "@std/assert";
import { Agent } from "@planigale/testing";
import { createApp } from "../../__tests__/app.ts";
import { Chat } from "../../__tests__/chat.ts";

const { app, repo } = createApp();

Deno.test("POST /api/commands/execute - unauthorized", async () => {
  const agent = await Agent.from(app);
  try {
    await agent.request().post("/api/commands/execute").json({}).expect(401);
  } finally {
    await agent.close();
  }
});

Deno.test("command /echo <text>", async () =>
  await Agent.test(
    app,
    { type: "handler" },
    async (agent) =>
      await Chat.init(repo, agent)
        .login("admin")
        .createChannel({ name: "test-commands" })
        .connectSSE()
        .executeCommand(
          "/echo Hello World!!",
          [],
          async ({ events, channelId }) => {
            const { event: msg } = await events.next();
            const msgJson = JSON.parse(msg?.data ?? "");
            assertEquals(msgJson.type, "message");
            assertEquals(msgJson.flat, "Hello World!!");
            assertEquals(msgJson.message.text, "Hello World!!");
            assertEquals(msgJson.channelId, channelId);
          },
        )
        .end(),
  ));

Deno.test("command /emoji <name>", async () =>
  await Agent.test(app, { type: "handler" }, async (agent) => {
    const state: any = {};
    try {
      await Chat.init(repo, agent)
        .login("admin")
        .createChannel({ name: "test-commands" })
        .connectSSE()
        .executeCommand("/emoji party-parrot", [
          {
            id: "party-parrot",
            fileName: "party-parrot.gif",
            contentType: "image/gif",
          },
        ], async ({ channelId }) => {
          state.channelId = channelId;
        })
        .nextEvent((event: any) => {
          assertEquals(event.type, "emoji");
          assertEquals(event.shortname, ":party-parrot:");
        })
        .nextEvent((event: any) => {
          assertEquals(event.type, "message");
          assertEquals(event.flat, "Emoji :party-parrot: created");
          assertEquals(event.message, {
            line: [{ text: "Emoji " }, { emoji: ":party-parrot:" }, {
              text: "created",
            }],
          });
          assertEquals(event.channelId, state.channelId);
        })
        .end();
    } finally {
      await repo.emoji.removeMany({ shortname: ":party-parrot:" });
    }
  }));

Deno.test("command /invite", async () => {
  await repo.invitation.removeMany({});
  return await Agent.test(app, { type: "handler" }, async (agent) => {
    let url: string | null = null;
    await Chat.init(repo, agent)
      .login("admin")
      .createChannel({ name: "test-commands-invite" })
      .connectSSE()
      .executeCommand("/invite", [], ({ json }) => {
        url = json.data;
      })
      .nextEvent((event: any) => {
        assertEquals(event.type, "message");
        const m = event.flat.match("(https?://.*/invite/[0-9a-f]{64})");
        assert(m, "Result should contain invitation link");
        assertEquals(m[1], url);
      })
      .end();
  });
});
