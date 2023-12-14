const assert = require('assert');
const api = require('../../tests/api');

describe('channels:load', () => {
  let user;

  before(async () => {
    user = await api.repo.user.get({ name: 'Admin' });
  });

  it('should return list of channels', async () => {
    const { res, data: channels } = await api.sendMessage({ type: 'channels:load' }, { userId: user.id });
    assert.equal(res.type, 'response');
    assert.equal(res.status, 'ok');
    const main = channels.find((c) => c.name === 'main');
    assert.ok(main);
    assert.equal(main.type, 'channel');
    assert.equal(main.name, 'main');
    assert.equal(main.cid, 'main');
    const admin = channels.find((c) => c.name === 'Admin');
    assert.ok(admin);
    assert.equal(admin.type, 'channel');
    assert.equal(admin.name, 'Admin');
    const member = channels.find((c) => c.name === 'Member');
    assert(!member);
  });
});
