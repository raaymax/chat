import { assertEquals } from "@std/assert";
import { createApp } from "../../__tests__/app.ts";
const { app, repo, core } = createApp();

Deno.test("GET /api/ping", async () => {
  const request = new Request("http://localhost:8000/api/ping");
  const res = await app.handle(request);
  assertEquals(res.status, 200);
  const body = await res.json();
  assertEquals(body.status, "ok");
});
