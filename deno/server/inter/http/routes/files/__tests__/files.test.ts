Deno.env.set("ENV_TYPE", "test");
import { Agent } from "@planigale/testing";
import app from "../../../mod.ts";
import { assert, assertEquals } from "@std/assert";
import { login } from "../../__tests__/helpers.ts";

const testTextFilePath =
  new URL("../../../../../tests/test.txt", import.meta.url).pathname;

Deno.test("/api/files - Authorization failed", async (t) => {
  await t.step("POST /api/files - should be authenticated", async () => {
    const res = await Agent.request(app)
      .post("/api/files")
      .file(testTextFilePath)
      .expect(401);
    const body = await res.json();
    assertEquals(body.errorCode, "ACCESS_DENIED");
  });

  await t.step("GET /api/files/:fileId - should be authenticated", async () => {
    const res = await Agent.request(app)
      .get("/api/files/testId")
      .expect(401);
    const body = await res.json();
    assertEquals(body.errorCode, "ACCESS_DENIED");
  });

  await t.step(
    "DELETE /api/files/:fileId - should be authenticated",
    async () => {
      const res = await Agent.request(app)
        .delete("/api/files/testId")
        .emptyBody()
        .expect(401);
      const body = await res.json();
      assertEquals(body.errorCode, "ACCESS_DENIED");
    },
  );
});

Deno.test("/api/files - Auth successful", async (t) => {
  const agent = await Agent.from(app);
  const { token } = await login(agent);
  let fileId: string | null = null;
  await t.step("POST /api/files - upload", async () => {
    const res = await agent.request()
      .post("/api/files/")
      .file(testTextFilePath)
      .header("Authorization", `Bearer ${token}`)
      .expect(200);
    const body = await res.json();
    assert(typeof body.id === "string");
    fileId = body.id;
  });

  await t.step("GET /api/files/:fileId - get", async () => {
    const res = await agent.request()
      .get(`/api/files/${fileId}`)
      .header("Authorization", `Bearer ${token}`)
      .expect(200);
    res.body?.cancel?.();
  });

  await t.step("DELETE /api/files/:fileId - delete", async () => {
    const res = await agent.request()
      .delete(`/api/files/${fileId}`)
      .emptyBody()
      .header("Authorization", `Bearer ${token}`)
      .expect(204);
    res.body?.cancel();
  });

  await agent.close();
});
