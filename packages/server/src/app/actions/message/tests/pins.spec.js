const assert = require('assert');
const api = require('../../tests/api');
const seeds = require('./seeds');

describe('message:pins', () => {
  let channel;
  let user;
  before(async () => {
    await seeds.run();
    channel = await api.repo.channel.get({ name: 'main' });
    user = await api.repo.user.get({ login: 'admin' });
  });
  after(async () => {
    await api.repo.close();
  });

  it('should return last added messsage', async () => {
    const { res, data: [msg] } = await api.sendMessage({
      type: 'message:pins',
      channelId: channel.id,
      limit: 1,
    }, { userId: user.id });
    assert.equal(res.type, 'response');
    assert.equal(res.status, 'ok');
    assert.equal(res.count, 1);
    assert.equal(msg.flat, 'Hello');
  });

  it('should have no access to someones private channel', async () => {
    const deniedChannel = await api.repo.channel.get({ name: 'denied' });
    const { res } = await api.sendMessage({
      type: 'message:pins',
      channelId: deniedChannel.id,
      limit: 1,
    }, { userId: user.id });
    assert.equal(res.type, 'response');
    assert.equal(res.status, 'error');
    assert.equal(res.message, 'ACCESS_DENIED');
  });

  it('should return continuation if after is specified', async () => {
    const { res, data: [msg1, msg2] } = await api.sendMessage({
      type: 'message:pins',
      channelId: channel.id,
      limit: 2,
    }, { userId: user.id });
    assert.equal(res.type, 'response');
    assert.equal(res.status, 'ok');
    const { res: res2, data: msgs } = await api.sendMessage({
      type: 'message:pins',
      channelId: channel.id,
      after: msg1.id,
      limit: 10,
    }, { userId: user.id });
    assert.equal(res2.type, 'response');
    assert.equal(res2.status, 'ok');
    assert.equal(msgs[0].id, msg2.id);
  });
});
