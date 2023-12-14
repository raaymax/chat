const assert = require('assert');
const api = require('../../tests/api');

describe('messages:load', () => {
  let user;
  let channel;

  before(async () => {
    user = await api.repo.user.get({ login: 'admin' });
    channel = await api.repo.channel.get({ name: 'main' });
  });

  it('should return last added message', async () => {
    const clientId = `${Math.random() + 1}`;
    await api.sendMessage({
      type: 'message:create',
      channelId: channel.id,
      clientId,
      message: { line: { text: 'Hello' } },
      flat: 'Hello',
    }, { userId: user.id, push: () => {} });
    const { res, data: [msg] } = await api.sendMessage({
      type: 'message:getAll',
      channelId: channel.id,
      limit: 1,
    }, { userId: user.id });
    assert.equal(res.type, 'response');
    assert.equal(res.status, 'ok');
    assert.equal(res.count, 1);
    assert.equal(msg.clientId, clientId);
    assert(!!msg.id);
  });

  it('should return list of messages', async () => {
    const { res, data: messages } = await api.sendMessage({
      type: 'message:getAll',
      channelId: channel.id,
      limit: 5,
    }, { userId: user.id });

    assert.equal(res.type, 'response');
    assert.equal(res.status, 'ok');
    assert.equal(messages[0].type, 'message');
    assert.equal(messages.length, 5);
  });

  it('should return messages before date', async () => {
    const { res, data: [msg, msg2, msg3] } = await api.sendMessage({
      type: 'message:getAll',
      channelId: channel.id,
      before: '2022-01-03',
      limit: 5,
    }, { userId: user.id });
    assert.equal(res.type, 'response');
    assert.equal(res.status, 'ok');
    assert.equal(msg.createdAt.toISOString(), new Date('2022-01-03').toISOString());
    assert.equal(msg2.createdAt.toISOString(), new Date('2022-01-02').toISOString());
    assert.equal(msg3.createdAt.toISOString(), new Date('2022-01-01').toISOString());
    assert.equal(res.count, 3);
  });

  it('should return messages after date', async () => {
    const { res, data: [msg, msg2] } = await api.sendMessage({
      type: 'message:getAll',
      channelId: channel.id,
      after: '2022-01-02',
      limit: 2,
    }, { userId: user.id });
    assert.equal(msg.createdAt.toISOString(), new Date('2022-01-03T00:00:00.000Z').toISOString());
    assert.equal(msg2.createdAt.toISOString(), new Date('2022-01-02T00:00:00.000Z').toISOString());
    assert.equal(res.count, 2);
  });

  it('should return error when channel is missing', async () => {
    const { res } = await api.sendMessage({
      type: 'message:getAll',
    }, { userId: user.id });
    assert.equal(res.status, 'error');
    assert.equal(res.message, '"channelId" is required');
  });

  it('should load messages from other channels', async () => {
    const testChannel = await api.repo.channel.get({ name: 'test' });
    const { res, data: messages } = await api.sendMessage({
      type: 'message:getAll',
      channelId: testChannel.id,
    }, { userId: user.id });
    assert.equal(res.status, 'ok');
    assert.deepEqual(messages, []);
  });

  it('should control access to private channels', async () => {
    const memberChannel = await api.repo.channel.get({ name: 'Member' });
    const { res, data: messages } = await api.sendMessage({
      type: 'message:getAll',
      channelId: memberChannel.id,
    }, { userId: user.id });
    assert.equal(res.status, 'error');
    assert.equal(res.message, 'ACCESS_DENIED');
    assert.equal(messages.length, 0);
  });
});
