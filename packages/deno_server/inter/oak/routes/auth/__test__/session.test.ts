import { assertEquals, assert } from "@std/assert";
import app from "../../../mod.ts";

Deno.test("GET /session - No session", async (t) => {
  const request = await superoak(app);
  await request.get("/auth/session").expect(200, {
    status: "no-session",
  });
})

Deno.test("POST /session - wrong params", async () => {
    const request = await superoak(app);
    const res = await request.post("/auth/session").send({});
    assertEquals(res.status, 400);
    assertEquals(res.body.map((i: {path: string}) => i.path).sort(), ['body.login', 'body.password']);
});

Deno.test("Login/logout", async (t) => {
  let token: any = null;
  let userId: any = null;

  await t.step('POST /session - Create session', async () => {
    const request = await superoak(app);
    const res = await request.post("/auth/session").send({
      login: "admin",
      password: "pass123",
    }).expect(200);
    assert(res.body.userId);
    assert(res.body.token);
    assert(res.body.id);
    token = res.body.token;
    userId = res.body.userId;
    assert(/^token=.*; path=\/; httponly$/.test(res.get('Set-Cookie').toString()), 'Set-Cookie header is not correct');
  });

  await t.step('GET /session - Get session with bearer', async () => {
    const request = await superoak(app);
    const res = await request
      .get("/auth/session")
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    assertEquals(res.body.userId, userId);
    assertEquals(res.body.token, token);
  });

  await t.step('GET /session - Get session with cookie', async () => {
    const request = await superoak(app);
    const res = await request
      .get("/auth/session")
      .set('cookie', `token=${token}`)
      .expect(200);
    assertEquals(res.body.userId, userId);
    assertEquals(res.body.token, token);
  });

  await t.step('DELETE /session', async () => {
    const request = await superoak(app);
    await request
      .delete("/auth/session")
      .set('cookie', `token=${token}`)
      .expect(200, {
        status: "ok",
      });
  });

  await t.step('GET /session - no session after delete', async () => {
    const request = await superoak(app);
    await request
      .get("/auth/session")
      .set('cookie', `token=${token}`)
      .expect(200, {
        status: "no-session",
      });
  });
})

