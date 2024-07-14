import { Application } from "@oak/oak";
import { assertEquals, assert } from "asserts";
import { superoak } from "superoak";
import app from "../../../mod.ts";
import { login } from "../../__tests__/helpers.ts";
import { repo } from "../../../../../infra/mod.ts";


Deno.test("POST /channels - unauthorized", async () => {
  {
    const res = await (await superoak(app)).post("/channels").send({ name: "test" });
    assertEquals(res.status, 401);
    assertEquals(res.body?.message, 'Unauthorized');
  }
  {
    const res = await (await superoak(app)).get("/channels");
    assertEquals(res.status, 401);
    assertEquals(res.body?.message, 'Unauthorized');
  }
  {
    const res = await (await superoak(app)).get("/channels/xyz");
    assertEquals(res.status, 401);
    assertEquals(res.body?.message, 'Unauthorized');
  }
  {
    const res = await (await superoak(app)).delete("/channels/xyz");
    assertEquals(res.status, 401);
    assertEquals(res.body?.message, 'Unauthorized');
  }
})

Deno.test("/channels - create/get/getAll/delete channel", async () => {
  const {token, userId} = await login(app);

  const request = await superoak(app);
  const res = await request.post("/channels").set('Authorization', 'bearer ' + token).send({
    name: "test",
  })
  const channelId = res.body.id;
  assertEquals(res.status, 200);

  const {db} = await repo.connect();
  const channel = await db.collection('channels').findOne({ _id: new repo.ObjectId(channelId) });
  assert(channel !== null);
  assertEquals(channel.name, 'test');
  assertEquals(channel.private, false);
  assertEquals(channel.direct, false);
  assertEquals(channel.users.map((u:repo.ObjectId)=>u.toHexString()), [userId]);
  assertEquals(channel.channelType, 'PUBLIC');

  const request2 = await superoak(app);
  const res2 = await request2.get(`/channels/${channelId}`).set('Authorization', 'bearer ' + token)
  assertEquals(res2.status, 200);
  assertEquals(res2.body.id, channelId);
  assertEquals(res2.body.name, 'test');

  const request3 = await superoak(app);
  const res3 = await request3.get(`/channels`).set('Authorization', 'bearer ' + token)
  assertEquals(res3.status, 200);
  assert(Array.isArray(res3.body));
  assertEquals(res3.body.find(({id}) => id === channelId).name, 'test');

  const request4 = await superoak(app);
  const res4 = await request4.delete(`/channels/${channelId}`).set('Authorization', 'bearer ' + token)
  assertEquals(res4.status, 200);
})
