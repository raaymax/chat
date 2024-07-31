import { assertEquals } from "@std/assert";
import app from "../../../mod.ts";

Deno.test("GET /api/ping", async () => {
  const request = new Request("http://localhost:8000/api/ping");
  const res = await app.handle(request);
  assertEquals(res.status, 200);
  const body = await res.json();
  assertEquals(body.status, "ok");
});
