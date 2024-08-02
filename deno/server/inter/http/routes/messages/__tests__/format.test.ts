Deno.env.set("ENV_TYPE", "test");
import { Agent } from "@planigale/testing";
import app from "../../../mod.ts";
import { assert, assertEquals } from "@std/assert";
import { login } from "../../__tests__/helpers.ts";
import { ObjectId } from "mongodb";
import { usingChannel } from "./usingChannel.ts";
import { ChannelType, EntityId } from "../../../../../types.ts";
import { repo } from "../../../../../infra/mod.ts";
/*
export const messageSchema = {
  $id: "message",
  definitions: {
    body: {
      oneOf: [
        { $ref: "message#/definitions/array" },
        { $ref: "message#/definitions/bullet" },
        { $ref: "message#/definitions/ordered" },
        { $ref: "message#/definitions/item" },
        { $ref: "message#/definitions/codeblock" },
        { $ref: "message#/definitions/blockquote" },
        { $ref: "message#/definitions/code" },
        { $ref: "message#/definitions/line" },
        { $ref: "message#/definitions/br" },
        { $ref: "message#/definitions/text" },
        { $ref: "message#/definitions/bold" },
        { $ref: "message#/definitions/italic" },
        { $ref: "message#/definitions/underline" },
        { $ref: "message#/definitions/strike" },
        { $ref: "message#/definitions/img" },
        { $ref: "message#/definitions/link" },
        { $ref: "message#/definitions/emoji" },
        { $ref: "message#/definitions/channel" },
        { $ref: "message#/definitions/user" },
        { $ref: "message#/definitions/thread" },
      ]
    },
    array: { type: "array", items: { $ref: "message#/definitions/body" } },
    bullet: { type: "object", required: ['bullet'], properties: { bullet: { $ref: "message#/definitions/body" } } },
    ordered: { type: "object", required: ['ordered'], properties: { ordered: { $ref: "message#/definitions/body" } } },
    item: { type: "object", required: ['item'], properties: { item: { $ref: "message#/definitions/body" } } },
    codeblock: { type: "object", required: ['codeblock'], properties: { codeblock: { type: "string" } } },
    blockquote: { type: "object", required: ['blockquote'], properties: { blockquote: { $ref: "message#/definitions/body" } } },
    code: { type: "object", required: ['code'], properties: { code: { type: "string" } } },
    line: { type: "object", required: ['line'], properties: { line: { $ref: "message#/definitions/body" } } },
    br: { type: "object", required: ['br'], properties: { br: { type: "boolean" } } },
    text: { type: "object", required: ['text'], properties: { text: { type: "string" } } },
    bold: { type: "object", required: ['bold'], properties: { bold: { $ref: "message#/definitions/body" } } },
    italic: { type: "object", required: ['italic'], properties: { italic: { $ref: "message#/definitions/body" } } },
    underline: { type: "object", required: ['underline'], properties: { underline: { $ref: "message#/definitions/body" } } },
    strike: { type: "object",required: ['strike'],  properties: { strike: { $ref: "message#/definitions/body" } } },
    img: { type: "object", required: ['img'], properties: { img: { type: "object", required: ['src'],  properties: { src: { type: "string" }, alt: { type: "string" } } } } },
    link: { type: "object", required: ['link'], properties: { link: { 
      type: "object", required: ['href', 'children'], properties: { href: { type: "string" }, children: { $ref: "message#/definitions/body" } } } } },
    emoji: { type: "object", required: ['emoji'], properties: { emoji: { type: "string" } } },
    channel: { type: "object", required: ['channel'], properties: { channel: { type: "string" } } },
    user: { type: "object", required: ['user'], properties: { user: { type: "string" } } },
    thread: { type: "object", required: ['thread'], properties: { thread: { 
      type: "object", required: ['channelId', 'parentId', 'text'], 
      properties: { channelId: { type: "string" }, parentId: { type: "string" }, text: { type: "string" } } } } },
  }
}
*/

const validId = new ObjectId().toHexString();

Deno.test("Check all validations for message field", async (t) => {
  const agent = await Agent.from(app);
  const { token, userId } = await login(agent);
  await usingChannel({
    name: "messages-formating-check",
    users: [EntityId.from(userId)],
  }, async (channelId) => {
    const testPart = (status: number, name: string, message: any) => t.step(name, () => agent.request()
      .post(`/api/channels/${channelId}/messages/`)
      .json({ 
         clientId: '123',
         flat: 'test',
         message
      })
      .header("Authorization", `Bearer ${token}`)
      .expect(status)
      .then(async (res)=>{
       await res.body?.cancel();
      }));
    await testPart(400, "Fail for empty", {});
    await testPart(200, "Pass for empty array", []);
    await testPart(200, "Pass for array with one element", [{ text: "Hello" }]);
    await testPart(400, "Fail if match many parts", { text: "Hello", emoji: "👋" });
    await testPart(200, "Pass for array with many elements", [{ text: "Hello" }, { emoji: "👋" }]);
    await testPart(200, "Pass for bullet", { bullet: {text: 'Hello'} });
    await testPart(200, "Pass for ordered", { ordered: {text: 'Hello'} });
    await testPart(200, "Pass for item", { item: {text: 'Hello'} });
    await testPart(200, "Pass for codeblock", { codeblock: 'Hello' });
    await testPart(200, "Pass for blockquote", { blockquote: {text: 'Hello'} });
    await testPart(200, "Pass for code", { code: 'Hello' });
    await testPart(200, "Pass for line", { line: {text: 'Hello'} });
    await testPart(200, "Pass for br", { br: true });
    await testPart(200, "Pass for text", { text: 'Hello' });
    await testPart(200, "Pass for bold", { bold: {text: 'Hello'} });
    await testPart(200, "Pass for italic", { italic: {text: 'Hello'} });
    await testPart(200, "Pass for underline", { underline: {text: 'Hello'} });
    await testPart(200, "Pass for strike", { strike: {text: 'Hello'} });
    await testPart(200, "Pass for img", { img: { src: 'Hello', alt: 'World' } });
    await testPart(200, "Pass for link", { link: { href: 'Hello', children: {text: 'World'} } });
    await testPart(200, "Pass for emoji", { emoji: '👋' });
    await testPart(200, "Pass for channel", { channel: validId });
    await testPart(400, "Fail for invalid channel id", { channel: 'invalid' });
    await testPart(400, "Fail for invalid channel id (minLength)", { channel: '0000000000000000000000000' });
    await testPart(400, "Fail for invalid channel id (maxLength)", { channel: '00000000000000000000000' });
    await testPart(200, "Pass for user", { user: validId });
    await testPart(400, "Fail for invalid user id", { user: 'invalid' });
    await testPart(200, "Pass for thread", { thread: { channelId: validId, parentId: validId, text: 'Hello' } });
    await testPart(400, "Fail for invalid thread text", { thread: { channelId: validId, parentId: validId } });
    await testPart(400, "Fail for invalid thread parentId", { thread: { channelId: validId, parentId: 'invalid', text: 'Hello' } });
    await testPart(400, "Fail for invalid thread channelId", { thread: { channelId: 'invalid', parentId: validId, text: 'Hello' } });

  });
  await agent.close();
})
