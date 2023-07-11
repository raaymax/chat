const assert = require('assert');
const api = require('./api');

describe('users:load', () => {
  let user;

  before(async () => {
    user = await api.repo.user.get({ name: 'Admin' });
  });

  it('should return list of users', async () => {
    const { res, data: users } = await api.sendMessage({
      type: 'users:load',
    }, { userId: user.id });
    assert.equal(res.type, 'response');
    assert.equal(res.status, 'ok');
    assert(users.length > 0);
    assert.deepEqual(
      Object.keys(users[0]).filter((k) => !k.startsWith('_')).sort(),
      ['type', 'id', 'name', 'avatarUrl', 'seqId', 'lastSeen', 'system', 'connected'].sort(),
    );
  });

  it('should get system user', async () => {
    const { data: users } = await api.sendMessage({
      type: 'users:load',
    }, { userId: user.id });
    const systemUser = users.find((u) => u.name === 'System');
    assert(!!systemUser);
    assert.equal(systemUser.system, true);
  });

  it('should gen only list of users for specific channel?');
});
