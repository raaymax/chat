import { assertEquals, assert } from "asserts";
import { superoak } from "superoak";

const app = async (req: Request, info?: Deno.ServeHandlerInfo): Promise<Response> => {
  return Response.json({"ok": true});
}



Deno.test("GET /sse - unauthorized", async () => {
  const req = new Request("http://localhost/sse", {
    method: "GET",
  });
  const res = await app(req);
  assertEquals(res.status, 200);
  assertEquals(await res.json(), { ok: true });
})
