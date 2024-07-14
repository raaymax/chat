import { assertEquals} from "@std/assert";
import app from "../../../mod.ts";
import { login } from "../../__tests__/helpers.ts";
import { TestingQuick } from "@codecat/planigale";

Deno.test("GET /sse - unauthorized", async () => {
  const request = new Request('http://localhost/sse');
  const res = await app.handle(request);
  assertEquals(res.status, 401);
  assertEquals(await res.json(), { message: "Unauthorized" });
});

Deno.test("/sse - auth", async () => {
  const {listen, fetch, getUrl, createEventSource, close} = new TestingQuick(app);
  await listen();
  try {
    let countMessages = 0;
    const {token} = await login(fetch);
    const source = createEventSource(`${getUrl()}/sse`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    for await (const _event of source) {
      countMessages++;
    }
    assertEquals(countMessages, 1);
    await source.close();
  } finally {
    await close();
  }
});
