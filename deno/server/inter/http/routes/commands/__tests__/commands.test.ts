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
        .executeCommand("/echo Hello World!!", [])
        .nextEvent((event, chat) => {
          assertEquals(event.type, "message");
          assert(event.id);
          assertEquals(event.flat, "Hello World!!");
          assertEquals(event.message.text, "Hello World!!");
          assertEquals(event.channelId, chat.channelId);
        })
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
          assert(event.id);
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
        assert(event.id);
        const m = event.flat.match("(https?://.*/invite/[0-9a-f]{64})");
        assert(m, "Result should contain invitation link");
        assertEquals(m[1], url);
      })
      .end();
  });
});

Deno.test("command /avatar", async () => {
  return await Agent.test(app, { type: "handler" }, async (agent) => {
    await Chat.init(repo, agent)
      .login("admin")
      .createChannel({ name: "test-commands-avatar" })
      .connectSSE()
      .executeCommand("/avatar", [
        {
          id: "party-parrot",
          fileName: "party-parrot.gif",
          contentType: "image/gif",
        },
      ])
      .nextEvent((event: any) => {
        assertEquals(event.type, "user");
        assertEquals(event.avatarFileId, "party-parrot");
      })
      .end();
  });
});

Deno.test("command /version", async () => {
  Deno.env.set("APP_VERSION", "server-version");
  return await Agent.test(app, { type: "handler" }, async (agent) => {
    await Chat.init(repo, agent)
      .login("admin")
      .createChannel({ name: "test-commands-version" })
      .connectSSE()
      .executeCommand("/version", [])
      .nextEvent((event) => {
        assertEquals(event.type, "message");
        assert(event.id);
        assertEquals(event.flat.includes("server-version"), true);
        assertEquals(event.flat.includes("client-version"), true);
      })
      .end();
  });
});

Deno.test("command /help", async () => {
  return await Agent.test(app, { type: "handler" }, async (agent) => {
    await Chat.init(repo, agent)
      .login("admin")
      .createChannel({ name: "test-commands-help" })
      .connectSSE()
      .executeCommand("/help", [])
      .nextEvent((event) => {
        assertEquals(event.type, "message");
        assert(event.id);
        assertEquals(event.flat.includes("/avatar"), true);
        assertEquals(event.flat.includes("/emoji"), true);
        assertEquals(event.flat.includes("/invite"), true);
        assertEquals(event.flat.includes("/version"), true);
      })
      .end();
  });
});

Deno.test("command /leave", async () => {
  return await Agent.test(app, { type: "handler" }, async (agent) => {
    await Chat.init(repo, agent)
      .login("admin")
      .createChannel({ name: "test-commands-leave" })
      .getChannels((channels) => {
        const channel = channels.find((c) => c.name === "test-commands-leave");
        assert(channel, "User should be in the channel");
      })
      .connectSSE()
      .executeCommand("/leave", [])
      .nextEvent((event, chat) => {
        assertEquals(event.type, "channel");
        assert(
          !event.users.find((u: any) => u === chat.userId),
          "Updated channel should not contain user",
        );
      })
      .nextEvent((event, chat) => {
        assertEquals(event.type, "removeChannel");
        assertEquals(event.channelId, chat.channelId);
      })
      .nextEvent((event) => {
        assertEquals(event.type, "message");
        assert(event.id);
        assertEquals(event.flat, "You have left the channel");
      })
      .getChannels((channels) => {
        const channel = channels.find((c) => c.name === "test-commands-leave");
        assert(!channel, "User should leave the channel");
      })
      .end();
  });
});

Deno.test("command /join", async () => {
  return await Agent.test(app, { type: "handler" }, async (agent) => {
    const member = Chat.init(repo, agent);
    await member
      .login("admin")
      .createChannel({ name: "test-commands-join" });
    await Chat.init(repo, agent)
      .login("admin")
      .step((chat) => {
        chat.channelId = member.channelId;
      })
      .connectSSE()
      .executeCommand("/join", [])
      .nextEvent((event, chat) => {
        assertEquals(event.type, "channel");
        assertEquals(event.id, chat.channelId);
      })
      .nextEvent((event) => {
        assertEquals(event.type, "message");
        assert(event.id);
        assertEquals(event.flat, "You have joined the channel");
      })
      .end();
  });
});
