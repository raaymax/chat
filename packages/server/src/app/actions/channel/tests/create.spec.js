const assert = require('assert');
const api = require('../../tests/api');

describe('channel:create', () => {
  const CHANNEL_NAME = 'some_name';
  let user;
  let otherUser;

  before(async () => {
    user = await api.repo.user.get({ name: 'Admin' });
    otherUser = await api.repo.user.get({ name: 'Member' });
  });

  after(async () => {
    await api.repo.close();
  });

  beforeEach(async () => {
    await api.repo.channel.remove({ name: CHANNEL_NAME });
  });

  it('should fail validation if name is not provided', async () => {
    const { res } = await api.sendMessage({ type: 'channel:create' }, { userId: user.id });
    assert.equal(res.status, 'error');
    assert.equal(res.message, '"name" is required');
  });

  it('should create new channel', async () => {
    const { res, data: [channel] } = await api.sendMessage({ type: 'channel:create', name: CHANNEL_NAME }, { userId: user.id });

    assert.equal(res.status, 'ok');
    assert.equal(channel.type, 'channel');
    assert.equal(channel.name, CHANNEL_NAME);
    assert.equal(channel.channelType, 'PUBLIC');
    assert.equal(channel.direct, false);
    assert.equal(channel.private, false);
  });

  it('should create new direct channel', async () => {
    const { res, data: [channel] } = await api.sendMessage({
      type: 'channel:create', channelType: 'DIRECT', name: 'Direct', users: [otherUser.id],
    }, { userId: user.id });

    const { res: res2, data: [channel2] } = await api.sendMessage({
      type: 'channel:create', channelType: 'DIRECT', name: 'Direct', users: [otherUser.id],
    }, { userId: user.id });

    assert.equal(res.status, 'ok');
    assert.equal(res2.status, 'ok');
    assert.equal(channel.type, 'channel');
    assert.equal(channel.name, 'Direct');
    assert.equal(channel.channelType, 'DIRECT');
    assert.equal(channel.id, channel2.id);
    assert.equal(channel.direct, true);
    assert.equal(channel.private, true);
  });

  it('should not create new direct channel if other user already created one', async () => {
    const { res, data: [channel] } = await api.sendMessage({
      type: 'channel:create', channelType: 'DIRECT', name: 'Direct', users: [user.id],
    }, { userId: otherUser.id });

    const { res: res2, data: [channel2] } = await api.sendMessage({
      type: 'channel:create', channelType: 'DIRECT', name: 'Direct', users: [otherUser.id],
    }, { userId: user.id });

    assert.equal(res.status, 'ok');
    assert.equal(res2.status, 'ok');
    assert.equal(channel.type, 'channel');
    assert.equal(channel.name, 'Direct');
    assert.equal(channel.channelType, 'DIRECT');
    assert.equal(channel.id, channel2.id);
    assert.equal(channel.direct, true);
    assert.equal(channel.private, true);
  });

  it('should return same channel if channel already exist', async () => {
    const { data: [channel1] } = await api.sendMessage({ type: 'channel:create', name: CHANNEL_NAME }, { userId: user.id });
    const { data: [channel2] } = await api.sendMessage({ type: 'channel:create', name: CHANNEL_NAME }, { userId: user.id });
    assert.equal(channel1.id, channel2.id);
  });
});
