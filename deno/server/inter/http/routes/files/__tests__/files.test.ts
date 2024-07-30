Deno.env.set('ENV_TYPE', 'test');
import { Agent } from "@planigale/testing";
import app from "../../../mod.ts";
import { assertEquals, assert } from "@std/assert";
import { login } from "../../__tests__/helpers.ts";

const testTextFilePath = new URL('../../../../../tests/test.txt', import.meta.url).pathname;

Deno.test("/files - Authorization failed", async (t) => {
  await t.step("POST /files - should be authenticated", async () => {
    const res = await Agent.request(app)
      .post('/files/')
      .file(testTextFilePath)
      .expect(401);
    const body = await res.json();
    assertEquals(body.errorCode, 'ACCESS_DENIED');
  })

  await t.step("GET /files/:fileId - should be authenticated", async () => {
    const res = await Agent.request(app)
      .get('/files/testId')
      .expect(401);
    const body = await res.json();
    assertEquals(body.errorCode, 'ACCESS_DENIED');
  })

  await t.step("DELETE /files/:fileId - should be authenticated", async () => {
    const res = await Agent.request(app)
      .delete('/files/testId')
      .emptyBody()
      .expect(401);
    const body = await res.json();
    assertEquals(body.errorCode, 'ACCESS_DENIED');
  })
})

Deno.test("/files - Auth successful", async (t) => {
  const agent = await Agent.from(app);
  const {token} = await login(agent);
  let fileId: string | null = null;
  await t.step("POST /files - upload", async () => {
    const res = await agent.request()
      .post('/files/')
      .file(testTextFilePath)
      .header('Authorization', `Bearer ${token}`)
      .expect(200);
    const body = await res.json();
    assert(typeof body.id === 'string');
    fileId = body.id;
  })

  await t.step("GET /files/:fileId - get", async () => {
    const res = await agent.request()
      .get(`/files/${fileId}`)
      .header('Authorization', `Bearer ${token}`)
      .expect(200);
    res.body?.cancel?.();
  })

  await t.step("DELETE /files/:fileId - delete", async () => {
    const res = await agent.request()
      .delete(`/files/${fileId}`)
      .emptyBody()
      .header('Authorization', `Bearer ${token}`)
      .expect(204);
    res.body?.cancel();
  })

  await agent.close();
})
