const assert = require('assert');
const api = require('./api');

describe('message:send', () => {
  let user;
  let user2;
  let channel;

  before(async () => {
    user = await api.repo.user.get({ login: 'mateusz' });
    user2 = await api.repo.user.get({ login: 'melisa' });
    channel = await api.repo.channel.get({ name: 'main' });
  });

  it('should update badge counter', async () => {
    await api.repo.badge.remove({ userId: user.id, channelId: channel.id });
    await api.repo.badge.create({ userId: user.id, channelId: channel.id, count: 0 });
    await createMessage({ userId: user2.id });
    const badge = await api.repo.badge.get({ userId: user.id, channelId: channel.id });
    assert.equal(badge.count, 1);
  });
  async function createMessage({ userId }) {
    const { res, data: [msg] } = await api.sendMessage({
      clientId: `${Math.random()}`,
      type: 'message:send',
      channelId: channel.id,
      message: { line: { text: 'Hello' } },
      flat: 'Hello',
    }, { userId, push:  () => {} });
    assert.equal(res.type, 'response');
    assert.equal(res.status, 'ok');
    return msg;
  }
});
