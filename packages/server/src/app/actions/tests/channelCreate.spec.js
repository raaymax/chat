const assert = require('assert');
const api = require('./api');

describe('channel:create', () => {
  const CHANNEL_NAME = 'some_name';
  let user;

  before(async () => {
    user = await api.repo.user.get({ name: 'Mateusz' });
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
  });

  it('should return same channel if channel already exist', async () => {
    const { data: [channel1] } = await api.sendMessage({ type: 'channel:create', name: CHANNEL_NAME }, { userId: user.id });
    const { data: [channel2] } = await api.sendMessage({ type: 'channel:create', name: CHANNEL_NAME }, { userId: user.id });
    assert.equal(channel1.id, channel2.id);
  });
});
