const assert = require('assert');
const { db } = require('../../src/infra/repositories');

module.exports = (connect) => {
  describe('badges', () => {
    let channel;
    before(async () => {
      channel = await (await db).collection('channels').findOne({ name: 'main' });
    });
    const sendHello = (ws) => ws.send({
      type: 'message:create',
      clientId: `test:${Math.random()}`,
      channelId: channel._id.toHexString(),
      message: { line: { text: 'Hello' } },
      flat: 'Hello',
    });

    it('should increment count when sending the message', async () => {
      const member = await connect('member');
      const user = await (await db).collection('users').findOne({ name: 'Admin' });
      await (await db).collection('messages').deleteMany({});
      await (await db).collection('badges').deleteMany({});
      await (await db).collection('badges').insertOne({ userId: user._id, channelId: channel._id, count: 0 });
      await sendHello(member);
      const badge = await (await db).collection('badges').findOne({ userId: user._id, channelId: channel._id });
      assert.equal(badge.count, 1);
      member.close();
    });

    it('should update counter to remaining messages', async () => {
      const admin = await connect('admin');
      const member = await connect('member');
      const user = await (await db).collection('users').findOne({ name: 'Admin' });
      await (await db).collection('badges').deleteMany({});
      await (await db).collection('badges').insertOne({ userId: user._id, channelId: channel._id, count: 0 });
      const [msg] = await sendHello(member);
      await (new Promise((resolve) => {
        setTimeout(() => resolve(), 2);
      })).then(() => sendHello(member));

      await admin.send({
        type: 'progress:update',
        messageId: msg.id,
      });
      const badge = await (await db).collection('badges').findOne({ userId: user._id, channelId: channel._id });
      assert.equal(badge.count, 1);
      admin.close();
      member.close();
    });

    it('should reset counter when sending message', async () => {
      const admin = await connect('admin');
      const member = await connect('member');
      const user = await (await db).collection('users').findOne({ name: 'Admin' });
      await (await db).collection('badges').deleteMany({});
      await (await db).collection('badges').insertOne({ userId: user._id, channelId: channel._id, count: 0 });
      await sendHello(member);
      await sendHello(member);
      await sendHello(admin);
      const badge = await (await db).collection('badges').findOne({ userId: user._id, channelId: channel._id });
      assert.equal(badge.count, 0);
      admin.close();
      member.close();
    });
  });
};
