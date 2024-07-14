import { assertEquals} from "@std/assert";
import app from "../../../mod.ts";

Deno.test("GET /ping", async () => {
  const request = new Request("http://localhost:8000/ping");
  const res = await app.handle(request);
  assertEquals(res.status, 200);
  const body = await res.json();
  assertEquals(body.status, "ok");
});


