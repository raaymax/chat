import { Agent } from "@planigale/testing";
import { assertEquals } from "@std/assert";
import { createApp } from "../../__tests__/app.ts";
import { Chat } from "../../__tests__/chat.ts";

const { app, repo } = createApp();

Deno.test("Pinning other user messsage", async (t) => {
  await Agent.test(app, { type: "handler" }, async (agent) => {
    let pinMessageId = "";
    const admin = Chat.init(repo, agent);
    const member = Chat.init(repo, agent);
    await admin.login("admin");
    await member.login("member");
    if (!member.userId) throw new Error("member.userId is undefined");
    await admin.createChannel({
      name: "test-messages-pin",
      users: [member.userId],
    });
    await member.gotoChannel("test-messages-pin");
    await admin.sendMessage({
      flat: "Hello",
      message: { text: "Hello" },
      clientId: "hello",
    }, (msg: any) => {
      pinMessageId = msg.id;
    });
    await member.pinMessage(pinMessageId)
      .getPinnedMessages((messages: any) => {
        assertEquals(messages.length, 1);
        assertEquals(messages[0].id, pinMessageId);
      });
    await admin.getPinnedMessages((messages: any) => {
      assertEquals(messages.length, 1);
      assertEquals(messages[0].id, pinMessageId);
    });
    await admin.end();
    await member.end();
  });
});
