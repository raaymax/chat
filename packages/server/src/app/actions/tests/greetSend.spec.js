const assert = require('assert');
const api = require('./api');

describe('greet:send', () => {
  let user;

  before(async () => {
    user = await api.repo.user.get({ name: 'Mateusz' });
  });

  it('should return welcome message', async () => {
    const { res, data: [msg] } = await api.sendMessage({ type: 'greet:send' }, { userId: user.id });
    assert.equal(res.type, 'response');
    assert.equal(res.status, 'ok');
    assert.equal(msg.type, 'message');
    assert.equal(msg.userId, 'system');
    assert.equal(msg.priv, true);
    assert.ok(Object.keys(msg).includes('createdAt'));
  });
});
