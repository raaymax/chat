Deno.env.set('ENV_TYPE', 'test');
import { assertEquals, assert } from "@std/assert";
import app from "../../../mod.ts";
import core from "../../../../../core/mod.ts";

Deno.test("GET /session - No session", async () => {
  const request = new Request('http://localhost/auth/session');
  const response = await app.handle(request);
  assertEquals(response.status, 200);
  assertEquals(await response.json(), {
    status: "no-session",
  });
})
Deno.test("POST /session - wrong params", async () => {
    const request = new Request('http://localhost/auth/session', {method: 'POST', body: JSON.stringify({asd: ""})});
    const res = await app.handle(request);
    assertEquals(res.status, 400);
    const body = await res.json();
    assertEquals(body.errors?.map((e: any) => e?.params?.missingProperty).sort(), [ 'login', 'password' ]);
});

Deno.test("Login/logout", async (t) => {
  let token: any = null;
  let userId: any = null;

  await t.step('POST /session - Create session', async () => {
    const request = new Request('http://localhost/auth/session', {
      method: 'POST',
      body: JSON.stringify({
        login: "admin",
        password: "pass123",
      }),
    });
    const res = await app.handle(request);
    assertEquals(res.status, 200);
    const body = await res.json();
    assert(body.userId);
    assert(body.token);
    assert(body.id);
    token = body.token;
    userId = body.userId;
    assert(/^token=.+; HttpOnly$/.test(res.headers.get('Set-Cookie')?.toString() ?? ""), 'Set-Cookie header is not correct');
  });

  await t.step('GET /session - Get session with bearer', async () => {
    const request = new Request('http://localhost/auth/session', {
      headers: new Headers({
        Authorization: `Bearer ${token}`,
      }),
    });
    const res = await app.handle(request);
    assertEquals(res.status, 200);
    const body = await res.json();
    assertEquals(body.userId, userId);
    assertEquals(body.token, token);
  });

  await t.step('GET /session - Get session with cookie', async () => {
    const request = new Request('http://localhost/auth/session', {
      headers: new Headers({
        cookie: `token=${token}`,
      }),
    });
    const res = await app.handle(request);
    assertEquals(res.status, 200);
    const body = await res.json();
    assertEquals(body.userId, userId);
    assertEquals(body.token, token);
  });

  await t.step('DELETE /session', async () => {
    const request = new Request('http://localhost/auth/session', {
      method: 'DELETE',
      headers: new Headers({
        cookie: `token=${token}`,
      }),
    });
    const res = await app.handle(request);
    assertEquals(res.status, 200);
    const body = await res.json();
    assertEquals(body.status, 'ok');
  });

  await t.step('GET /session - no session after delete', async () => {
    const request = new Request('http://localhost/auth/session', {
      headers: new Headers({
        cookie: `token=${token}`,
      }),
    });
    const res = await app.handle(request);
    assertEquals(res.status, 200);
    const body = await res.json();
    assertEquals(body.status, 'no-session');
  });

  core.close();
})
