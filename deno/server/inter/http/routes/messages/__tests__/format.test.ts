Deno.env.set("ENV_TYPE", "test");
import { Agent } from "@planigale/testing";
import { login, usingChannel } from "../../__tests__/mod.ts";
import { ObjectId } from "mongodb";
import { EntityId } from "../../../../../types.ts";
import { createApp } from "../../__tests__/app.ts";
const { app, repo, core } = createApp();

const validId = new ObjectId().toHexString();

Deno.test("Check all validations for message field", async (t) => {
  const agent = await Agent.from(app);
  const { token, userId } = await login(repo, agent);
  await usingChannel(repo, {
    name: "messages-formating-check",
    users: [EntityId.from(userId)],
  }, async (channelId) => {
    const testPart = (status: number, name: string, message: any) =>
      t.step(name, () =>
        agent.request()
          .post(`/api/channels/${channelId}/messages/`)
          .json({
            clientId: "123",
            flat: "test",
            message,
          })
          .header("Authorization", `Bearer ${token}`)
          .expect(status)
          .then(async (res) => {
            await res.body?.cancel();
          }));
    await testPart(400, "Should return status 400 for empty", {});
    await testPart(200, "Should return status 200 for empty array", []);
    await testPart(200, "Should return status 200 for array with one element", [
      { text: "Hello" },
    ]);
    await testPart(400, "Should return status 400 if match many parts", {
      text: "Hello",
      emoji: "👋",
    });
    await testPart(
      200,
      "Should return status 200 for array with many elements",
      [{ text: "Hello" }, { emoji: "👋" }],
    );
    await testPart(200, "Should return status 200 for bullet", {
      bullet: { text: "Hello" },
    });
    await testPart(200, "Should return status 200 for ordered", {
      ordered: { text: "Hello" },
    });
    await testPart(200, "Should return status 200 for item", {
      item: { text: "Hello" },
    });
    await testPart(200, "Should return status 200 for codeblock", {
      codeblock: "Hello",
    });
    await testPart(200, "Should return status 200 for blockquote", {
      blockquote: { text: "Hello" },
    });
    await testPart(200, "Should return status 200 for code", { code: "Hello" });
    await testPart(200, "Should return status 200 for line", {
      line: { text: "Hello" },
    });
    await testPart(200, "Should return status 200 for br", { br: true });
    await testPart(200, "Should return status 200 for text", { text: "Hello" });
    await testPart(200, "Should return status 200 for bold", {
      bold: { text: "Hello" },
    });
    await testPart(200, "Should return status 200 for italic", {
      italic: { text: "Hello" },
    });
    await testPart(200, "Should return status 200 for underline", {
      underline: { text: "Hello" },
    });
    await testPart(200, "Should return status 200 for strike", {
      strike: { text: "Hello" },
    });
    await testPart(200, "Should return status 200 for img", {
      img: { src: "Hello", alt: "World" },
    });
    await testPart(200, "Should return status 200 for link", {
      link: { href: "Hello", children: { text: "World" } },
    });
    await testPart(200, "Should return status 200 for emoji", { emoji: "👋" });
    await testPart(200, "Should return status 200 for channel", {
      channel: validId,
    });
    await testPart(400, "Should return status 400 for invalid channel id", {
      channel: "invalid",
    });
    await testPart(
      400,
      "Should return status 400 for invalid channel id (minLength)",
      { channel: "0000000000000000000000000" },
    );
    await testPart(
      400,
      "Should return status 400 for invalid channel id (maxLength)",
      { channel: "00000000000000000000000" },
    );
    await testPart(200, "Should return status 200 for user", { user: validId });
    await testPart(400, "Should return status 400 for invalid user id", {
      user: "invalid",
    });
    await testPart(200, "Should return status 200 for thread", {
      thread: { channelId: validId, parentId: validId, text: "Hello" },
    });
    await testPart(400, "Should return status 400 for invalid thread text", {
      thread: { channelId: validId, parentId: validId },
    });
    await testPart(
      400,
      "Should return status 400 for invalid thread parentId",
      { thread: { channelId: validId, parentId: "invalid", text: "Hello" } },
    );
    await testPart(
      400,
      "Should return status 400 for invalid thread channelId",
      { thread: { channelId: "invalid", parentId: validId, text: "Hello" } },
    );
  });
  await agent.close();
});
