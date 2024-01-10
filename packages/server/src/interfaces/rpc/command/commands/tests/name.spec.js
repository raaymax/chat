const assert = require('assert');
const api = require('../../actions/tests/api');

describe('/name <name>', () => {
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

  it('should change users name', async () => {
    const { res, data: [user] } = await api.sendMessage({
      type: 'command:execute',
      name: 'name',
      args: [NAME],
      context: {
        channelId: channel.id,
      },
    }, { userId: admin.id });
    assert.equal(res.type, 'response');
    assert.equal(res.status, 'ok');

    const state = await api.repo.user.get({ login: 'admin' });
    assert.equal(state.name, NAME);
    assert.equal(user.type, 'user');
    assert.equal(user.name, NAME);
  });

  it('should inform others about change');
});
