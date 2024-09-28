import { Agent } from "@planigale/testing";
import { createApp } from "../../__tests__/app.ts";
import { Chat } from "../../__tests__/chat.ts";
import { assertEquals } from "@std/assert";

const {app, repo} = createApp();

Deno.test("sending messages to threads", async (t) => {
  await Agent.test(app, {type: 'handler'}, async (agent) => {
    await Chat.init(repo, agent)
      .login("admin")
      .createChannel({ name: "test-messages-threads" })
      .sendMessage({ flat: "Hello", message: { text: "Hello" }, clientId: "hello0" })
      .sendMessage({ flat: "Hello", message: { text: "Hello" }, clientId: "hello1" }, (msg: any, {state}) => {
        state.parentId = msg.id;
      })
      .sendMessage({ flat: "Hello", message: { text: "Hello" }, clientId: "hello2" })
      //.sendMessage(({state}) => ({ flat: "msg1", message: { text: "thread" }, clientId: "hello3", parentId: state.parentId }))
      //.sendMessage(({state}) => ({ flat: "msg2", message: { text: "thread" }, clientId: "hello4", parentId: state.parentId }))
      .end();
  });
});

    
