import { assert, assertEquals } from "@std/assert";
import { Agent } from "@planigale/testing";
import { ensureUser, login } from "../../__tests__/mod.ts";
import { User } from "../../../../../types.ts";
import { createApp } from "../../__tests__/app.ts";
import { Chat } from "../../__tests__/chat.ts";

const { app, repo, core } = createApp();

Deno.test("POST /api/users - user creation flow", async (t) => {
  let url: string;
  let token: string;
  await ensureUser(repo, "admin", { name: "Admin" });
  await Agent.test(app, { type: "handler" }, async (agent) => {
    const admin = Chat.init(repo, agent);
    try {
      await admin.login("admin")
        .createChannel({ name: "user-invite-test" })
        .sendMessage({ flat: "secret" });

      await t.step("creating invite", async () => {
        await admin.executeCommand("/invite", [], ({ json }: any) => {
          url = json.data;
        });
        const m = url.match(/https?:\/\/.*\/invite\/(.*)$/);
        assert(m);
        token = m[1];
      });
      await t.step("check valid token", async () => {
        await Chat.init(repo, agent)
          .checkToken(token, ({ valid }) => assert(valid));
      });

      await t.step("register user", async () => {
        await Chat.init(repo, agent)
          .checkToken(token, ({ valid }) => assert(valid))
          .register({
            token,
            name: "Jack",
            email: "jack",
            password: "test123",
          })
          .login("jack", "test123")
          .openChannel("user-invite-test")
          .getMessages({}, (msgs: any[]) => {
            assertEquals(msgs[0].flat, "secret");
          })
          .end();
      });

      await t.step("check invalid token", async () => {
        await Chat.init(repo, agent)
          .checkToken(token, ({ valid }) => assert(!valid))
          .end();

        await agent.request()
          .post(`/api/users/${token}`)
          .json({
            token,
            name: "Jack",
            email: "jack",
            password: "test123",
          })
          .expect(400, {
            errorCode: "INVALID_INVITATION",
            message: "Invalid invitation link",
          });
      });
    } finally {
      await admin.end();
    }
  });
});
