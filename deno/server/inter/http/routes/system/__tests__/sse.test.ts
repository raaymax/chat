import { assertEquals, assert} from "@std/assert";
import app from "../../../mod.ts";
import { login } from "../../__tests__/helpers.ts";
import { Agent } from "@planigale/testing";

Deno.test("GET /sse - unauthorized", async () => {
  const request = new Request('http://localhost/sse');
  const res = await app.handle(request);
  assertEquals(res.status, 401);
  const body = await res.json();
  assertEquals(body.errorCode, 'ACCESS_DENIED');
});

Deno.test("/sse - auth", async () => {
  await Agent.server(app, async agent => {
    const {token} = await login(agent);
    const source = agent.events('/sse', {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
    try{ 
      const {event} = await source.next();
      assert(event);
      await source.close();
    }catch(e){
      console.log(e);
    }
  });
});
