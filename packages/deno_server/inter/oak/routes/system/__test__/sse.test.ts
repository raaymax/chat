import { assertEquals, assert } from "asserts";
import { superoak } from "superoak";
import app from "../../../mod.ts";
import { login } from "../../__tests__/helpers.ts";

Deno.test("GET /sse - unauthorized", async () => {
  const res = await (await superoak(app)).get("/sse");
  assertEquals(res.status, 401);
  assertEquals(res.body, { message: "Unauthorized" });
})
/*
Deno.test("/sse", async () => {
  const {token, userId} = await login(app);

  const res = await (await superoak(app)).get("/sse").set('Authorization', 'bearer ' + token);
  console.log(res.body);
  assertEquals(res.status, 200);
});
*/
