const assert = require('assert');
const api = require('../../tests/api');

describe('message:update', () => {
  let user;
  let channel;
  let messageId;

  before(async () => {
    user = await api.repo.user.get({ login: 'admin' });
    channel = await api.repo.channel.get({ name: 'main' });
    messageId = await api.repo.message.create({
      message: { text: 'asd' }, channelId: channel.id, flat: 'asd', userId: user.id, clientId: `x${Math.random()}`,
    });
  });
  after(async () => {
    await api.repo.close();
  });

  it('should update message', async () => {
    const { res, data: [msg] } = await api.sendMessage({
      type: 'message:update',
      id: messageId,
      flat: 'test',
    }, { userId: user.id });
    assert.equal(res.type, 'response');
    assert.equal(res.status, 'ok');
    assert.equal(msg.id, messageId);
    assert.equal(msg.type, 'message');
    assert.equal(msg.flat, 'test');
    assert.deepEqual(msg.message, { text: 'asd' });
  });
});
