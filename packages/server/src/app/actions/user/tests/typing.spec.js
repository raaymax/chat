const assert = require('assert');
const api = require('../../tests/api');

describe('user:typing', () => {
  let user;
  let channel;

  before(async () => {
    user = await api.repo.user.get({ name: 'Admin' });
    channel = await api.repo.channel.get({ name: 'main' });
  });
  after(async () => {
    await api.repo.close();
  });

  it('should return welcome message', async () => {
    const { res, data: [msg] } = await api.sendMessage({
      type: 'user:typing',
      channelId: channel.id,
    }, {
      userId: user.id,
    });
    assert.equal(res.type, 'response');
    assert.equal(res.status, 'ok');
  });
});
