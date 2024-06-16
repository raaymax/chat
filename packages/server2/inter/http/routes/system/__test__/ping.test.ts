import { superoak } from "superoak";
import app from "../../../mod.ts";

Deno.test("GET /ping", async () => {
  const request = await superoak(app);
  await request.get("/ping").expect(200, { status: "ok" });
})


