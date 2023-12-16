const assert = require('assert');
const api = require('./api');

describe('fcm:setup', () => {
  let user;
  before(async () => {
    await api.repo.user.update({ login: 'admin' }, { notifications: {} });
    user = await api.repo.user.get({ login: 'admin' });
  });
  it('should update fcm token for current session', async () => {
    const token = 'testToken';
    const { res } = await api.sendMessage({
      type: 'fcm:setup',
      token,
    }, { userId: user.id });
    assert.equal(res.type, 'response');
    assert.equal(res.status, 'ok');
    const updatedUser = await api.repo.user.get({ id: user.id });
    assert.ok(updatedUser.notifications[token]);
  });
  it('should throw error when token is not present', async () => {
    const { res } = await api.sendMessage({
      type: 'fcm:setup',
    }).catch((e) => e);
    assert.equal(res.status, 'error');
    assert.equal(res.message, '"token" is required');
  });
});
