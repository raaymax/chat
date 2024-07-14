import { assertEquals } from "@std/assert";
import { TestingQuick } from "@codecat/planigale";
import app from "../../../mod.ts";
import { login } from "../../__tests__/helpers.ts";

const __dirname = new URL('.', import.meta.url).pathname;

Deno.test("POST /files", async () => {
  const { listen, fetch, getUrl, close } = new TestingQuick(app);
  await listen();
  try{
    const file = await Deno.readFile(__dirname + 'test.txt');
    const formData = new FormData();
    formData.append('file', new Blob([file]), 'file.txt');
    const res = await fetch(`${getUrl()}/files`, {method: "POST", body: formData});
    const body = await res.json();
    console.log(body)
    assertEquals(res.status, 200);
    assertEquals(body?.ok, 'true');
  } finally {
    await close();
  }
})
