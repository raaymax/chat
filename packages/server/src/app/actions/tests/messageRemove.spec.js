const assert = require('assert');
const api = require('./api');

describe('message:remove', () => {
  let user;
  let user2;
  let channel;
  let context;
  let context2;

  before(async () => {
    user = await api.repo.user.get({ name: 'Admin' });
    user2 = await api.repo.user.get({ name: 'Member' });
    channel = await api.repo.channel.get({ name: 'main' });
    context = { userId: user.id, push: () => {} };
    context2 = { userId: user2.id, push: () => {} };
  });

  it('should remove message', async () => {
    const toBeRemoved = await createMessage(context);
    const { res, data: [msg] } = await api.sendMessage({
      type: 'message:remove',
      id: toBeRemoved.id,
    }, context);
    assert.equal(res.type, 'response');
    assert.equal(res.status, 'ok');
    assert.equal(msg.id, toBeRemoved.id);
    assert.equal(msg.type, 'message');
    assert.equal(msg.notif, 'Message removed');
    assert.deepEqual(msg.message, []);
  });

  it('should prevent deletion of not owned messages', async () => {
    const toBeRemoved = await createMessage(context);
    const { res } = await api.sendMessage({
      type: 'message:remove',
      id: toBeRemoved.id,
    }, context2);
    assert.equal(res.type, 'response');
    assert.equal(res.status, 'error');
    assert.equal(res.message, 'NOT_OWNER_OF_MESSAGE');
  });

  async function createMessage(ctx) {
    const { res, data: [msg] } = await api.sendMessage({
      clientId: `${Math.random()}`,
      type: 'message:send',
      channelId: channel.id,
      message: { line: { text: 'Hello' } },
      flat: 'Hello',
    }, ctx);
    assert.equal(res.type, 'response');
    assert.equal(res.status, 'ok');
    return msg;
  }
});
