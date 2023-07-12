const assert = require('assert');
const api = require('../../actions/tests/api');

describe('/rename-channel [name]', () => {
  let user;
  let otherUser;
  let channelId;

  before(async () => {
    user = await api.repo.user.get({ login: 'admin' });
    otherUser = await api.repo.user.get({ login: 'member' });
  });

  afterEach(async () => {
    await api.repo.channel.remove({ id: channelId });
  });

  it('should be unable to change unowned channels name', async () => {
    channelId = await api.repo.channel.create({ channelType: 'PUBLIC', users: [otherUser.id], name: 'test' });
    const { res } = await api.sendMessage({
      type: 'command:execute',
      name: 'rename-channel',
      args: ['newName'],
      context: {
        channelId,
      },
    }, { userId: user.id });
    assert.equal(res.status, 'error');
    assert.equal(res.message, 'CANT_RENAME_CHANNEL');
  });

  it('should change channel name', async () => {
    channelId = await api.repo.channel.create({ channelType: 'PUBLIC', users: [user.id, otherUser.id], name: 'test' });
    const { res } = await api.sendMessage({
      type: 'command:execute',
      name: 'rename-channel',
      args: ['newName'],
      context: {
        channelId,
      },
    }, { userId: user.id });
    assert.equal(res.status, 'ok');
    const channel = await api.repo.channel.get({ id: channelId });
    assert.equal(channel.name, 'newName');
  });

  it('should return error when changing DIRECT channel', async () => {
    channelId = await api.repo.channel.create({ channelType: 'DIRECT', users: [user.id, otherUser.id], name: 'Direct' });
    const { res } = await api.sendMessage({
      type: 'command:execute',
      name: 'rename-channel',
      args: ['newName'],
      context: {
        channelId,
      },
    }, { userId: user.id });
    assert.equal(res.status, 'error');
    assert.equal(res.message, 'CANT_RENAME_CHANNEL');

    const channel = await api.repo.channel.get({ id: channelId });
    assert.equal(channel.name, 'Direct');
  });
});
