import { assertEquals, assert } from "@std/assert";
import { TestingQuick } from "@codecat/planigale";
import app from "../../../mod.ts";
import { login } from "../../__tests__/helpers.ts";
import { repo } from "../../../../../infra/mod.ts";


Deno.test("POST /channels - unauthorized", async () => {
  const { listen, fetch, getUrl, close } = new TestingQuick(app);
  await listen();
  try{
    {
      const res = await fetch(`${getUrl()}/channels`, {method: "POST"});
      assertEquals(res.status, 401);
      const body = await res.json();
      assertEquals(body?.message, 'Unauthorized');
    } 
    {
      const res = await fetch(`${getUrl()}/channels`, {method: "GET"});
      assertEquals(res.status, 401);
      const body = await res.json();
      assertEquals(body?.message, 'Unauthorized');
    } 
    {
      const res = await fetch(`${getUrl()}/channels/xyz`, {method: "GET"});
      assertEquals(res.status, 401);
      const body = await res.json();
      assertEquals(body?.message, 'Unauthorized');
    } 
    {
      const res = await fetch(`${getUrl()}/channels/xyz`, {method: "DELETE"});
      assertEquals(res.status, 401);
      const body = await res.json();
      assertEquals(body?.message, 'Unauthorized');
    }
  } finally {
    await close();
  }
})

Deno.test("/channels - create/get/getAll/delete channel", async () => {
  const { listen, fetch, getUrl, close } = new TestingQuick(app);
  await listen();
  const {token, userId} = await login(fetch);
  try{
    const res = await fetch(`${getUrl()}/channels`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "test",
      }),
    });

    const body = await res.json();
    const channelId = body.id;
    assertEquals(res.status, 200);

    const {db} = await repo.connect();
    const channel = await db.collection('channels').findOne({ _id: new repo.ObjectId(channelId) });
    assert(channel);
    assertEquals(channel.name, 'test');
    assertEquals(channel.private, false);
    assertEquals(channel.direct, false);
    assertEquals(channel.users.map((u:repo.ObjectId)=>u.toHexString()), [userId]);
    assertEquals(channel.channelType, 'PUBLIC');

    const res2 = await fetch(`${getUrl()}/channels/${channelId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const body2 = await res2.json();
    assertEquals(res2.status, 200);
    assertEquals(body2.id, channelId);
    assertEquals(body2.name, 'test');

    const res3 = await fetch(`${getUrl()}/channels`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    assertEquals(res3.status, 200);
    const body3 = await res3.json();
    assert(Array.isArray(body3));
    assertEquals(body3.find(({id}: {id: string}) => id === channelId).name, 'test');

    const res4 = await fetch(`${getUrl()}/channels/${channelId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    assertEquals(res4.status, 200);
  } finally {
    await close();
  }
})
