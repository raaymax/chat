Deno.env.set('ENV_TYPE', 'test');
import { Agent } from "@planigale/testing";
import app from "../../../mod.ts";
import { assertEquals } from "@std/assert";
import { login } from "../../__tests__/helpers.ts";

Deno.test("/messages - Authorization failed", async (t) => {
  await t.step("POST /messages - should be authenticated", async () => {
    const res = await Agent.request(app)
      .post('/messages/')
      .json({})
      .expect(401);
    const body = await res.json();
    assertEquals(body.errorCode, 'ACCESS_DENIED');
  })

  await t.step("GET /messages/ - should be authenticated", async () => {
    const res = await Agent.request(app)
      .get('/messages/')
      .expect(401);
    const body = await res.json();
    assertEquals(body.errorCode, 'ACCESS_DENIED');
  })

  await t.step("PATCH /messages/:messageId - should be authenticated", async () => {
    const res = await Agent.request(app)
      .patch('/messages/messageId')
      .json({})
      .expect(401);
    const body = await res.json();
    assertEquals(body.errorCode, 'ACCESS_DENIED');
  })

  await t.step("DELETE /messages/:messageId - should be authenticated", async () => {
    const res = await Agent.request(app)
      .delete('/messages/messageId')
      .emptyBody()
      .expect(401);
    const body = await res.json();
    assertEquals(body.errorCode, 'ACCESS_DENIED');
  })
})


Deno.test("/messages - Auth successful", async (t) => {
  await t.step("POST /messages - create", async () => {
    const agent = await Agent.from(app);
    const { token } = await login(agent);
    const res = await agent.request()
      .post('/messages/')
      .json({
        title: "test",
        content: "test",
      })
      .header('Authorization', `Bearer ${token}`)
      .expect(200);
    const body = await res.json();
    assertEquals(body.title, "test");
    assertEquals(body.content, "test");
  });
});

