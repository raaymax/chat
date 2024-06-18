import { assertEquals, assert } from "asserts";
import { superoak } from "superoak";
import app from "../../../mod.ts";
import { login } from "../../__tests__/helpers.ts";
import { repo } from "../../../../../infra/mod.ts";

Deno.test("POST /channels", async (t) => {
  const request = await superoak(app);
  const res = await request.post("/channels").send({
    name: "test",
  })
  assertEquals(res.status, 401);
  assertEquals(res.body?.message, 'Unauthorized');
})

Deno.test("POST /channels", async (t) => {
  const {token, userId} = await login(app);
  let channelId: string;

  await t.step('POST /channels - Create channel', async () => {
    const request = await superoak(app);
    const res = await request.post("/channels").set('Authorization', 'bearer ' + token).send({
      name: "test",
    })
    channelId = res.body.id;
    assertEquals(res.status, 200);

    console.log('Channel in database ')
    const {db} = await repo.connect();
    const channel = await db.collection('channels').findOne({ _id: new repo.ObjectId(channelId) });
    assert(channel !== null);
    assertEquals(channel.name, 'test');
    assertEquals(channel.private, false);
    assertEquals(channel.direct, false);
    assertEquals(channel.users.map((u:repo.ObjectId)=>u.toHexString()), [userId]);
    assertEquals(channel.channelType, 'PUBLIC');


    console.log('DELETE /channels/:channelId - remove channel')
    console.log('tes2t', channelId);
    const request2 = await superoak(app);
    const res2 = await request2.delete(`/channels/${channelId}`).set('Authorization', 'bearer ' + token)
    assertEquals(res2.status, 200);
  });
})
