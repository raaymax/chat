const assert = require('assert');
const api = require('../../actions/tests/api');

describe('/me', () => {
  const NAME = 'Admin';
  let channel;
  let admin;

  before(async () => {
    admin = await api.repo.user.get({ login: 'admin' });
    channel = await api.repo.channel.get({ name: 'main' });
    await api.repo.user.update({ login: 'admin' }, { name: 'Johny' });
  });

  after(async () => {
    await api.repo.user.update({ login: 'admin' }, { name: 'Admin' });
  });

  it('should return message with imformation about user', async () => {
    const { res, data: [user] } = await api.sendMessage({
      type: 'command:execute',
      name: 'me',
      args: [],
      context: {
        channelId: channel.id,
      },
    }, { userId: admin.id });
    assert.equal(res.type, 'response');
    assert.equal(res.status, 'ok');

    assert.equal(user.type, 'message');
  });
});
