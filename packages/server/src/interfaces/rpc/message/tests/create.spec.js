const assert = require('assert');
const api = require('../../tests/api');

describe('message:create', () => {
  let user;
  let user2;
  let channel;

  before(async () => {
    user = await api.repo.user.get({ login: 'admin' });
    user2 = await api.repo.user.get({ login: 'member' });
    channel = await api.repo.channel.get({ name: 'main' });
  });
  after(async () => {
    await api.repo.close();
  });

  it('should update badge counter', async () => {
    await api.repo.badge.remove({ userId: user.id, channelId: channel.id });
    await api.repo.badge.create({ userId: user.id, channelId: channel.id, count: 0 });
    await createMessage({ userId: user2.id });
    const badge = await api.repo.badge.get({ userId: user.id, channelId: channel.id });
    assert.equal(badge.count, 1);
  });

  it('should push notification to the channel', async () => {
    const res = await createMessage({ userId: user2.id });
    const { push: [notif] } = res;
    assert.equal(notif.data.title, 'Member on main');
  });

  it('should push notification to all user endpoints');

  async function createMessage({ userId, ...data }) {
    const push = [];
    const { res, data: [msg] } = await api.sendMessage({
      clientId: `${Math.random()}`,
      type: 'message:create',
      channelId: channel.id,
      message: { line: { text: 'Hello' } },
      flat: 'Hello',
      ...data,
    }, { userId, push: async (subs, notif) => push.push({ ...notif, subs }) });
    assert.equal(res.type, 'response');
    assert.equal(res.status, 'ok');
    return { ...msg, push };
  }

  it('should store message in database', async () => {
    const clientId = `${Math.random() + 1}`;
    await createMessage({
      userId: user.id,
      clientId,
    });
    const msg = await api.repo.message.get({ clientId });
    assert.equal(msg.message?.line?.text, 'Hello');
    assert.equal(msg.flat, 'Hello');
    assert.ok(Object.keys(msg).includes('createdAt'));
    assert.equal(msg.clientId, clientId);
  });

  it('should accept attachments', async () => {
    const msg = await createMessage({
      userId: user.id,
      attachments: [
        {
          id: 'random',
          fileName: 'test.txt',
          contentType: 'text/plain',
          sonething: 'else',
        },
      ],
    });
    assert.equal(msg.type, 'message');
    assert.equal(msg.attachments.length, 1);
    assert.deepEqual(Object.keys(msg.attachments[0]), ['id', 'fileName', 'contentType']);
  });

  it('should not broadcast when sending to private channels');

  it('should validate attachments?');

  it('should accept attachments without message');

  it('should return error when channelId is missing', async () => {
    const { res } = await api.sendMessage({
      type: 'message:create',
      clientId: `test:${Math.random()}`,
      message: { line: { text: 'Hello' } },
      flat: 'Hello',
    }, { userId: user.id });
    assert.equal(res.status, 'error');
    assert.equal(res.message, '"channelId" is required');
  });

  it('should return error when message is missing', async () => {
    const { res } = await api.sendMessage({
      type: 'message:create',
      clientId: `test:${Math.random()}`,
      channelId: channel.id,
      flat: 'Hello',
    }, { userId: user.id });
    assert.equal(res.status, 'error');
    assert.equal(res.message, '"message" is required');
  });

  it('should control access to private channels', async () => {
    const otherChannel = await api.repo.channel.get({ name: 'Member' });
    const { res } = await api.sendMessage({
      type: 'message:create',
      clientId: `test:${Math.random()}`,
      channelId: otherChannel.id,
      message: { text: 'Hello' },
      flat: 'Hello',
    }, { userId: user.id });
    assert.equal(res.type, 'response');
    assert.equal(res.status, 'error');
    assert.equal(res.message, 'ACCESS_DENIED');
  });

  it('should return error when flat is missing', async () => {
    const { res } = await api.sendMessage({
      type: 'message:create',
      clientId: `test:${Math.random()}`,
      channelId: channel.id,
      message: { text: 'Hello' },
    }, { userId: user.id });
    assert.equal(res.type, 'response');
    assert.equal(res.status, 'error');
    assert.equal(res.message, '"flat" is required');
  });
});
