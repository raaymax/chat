const assert = require('assert');
const api = require('./api');

describe('badges:load', () => {
  let user;

  before(async () => {
    user = await api.repo.user.get({ login: 'admin' });
  });

  it('should return list of badges', async () => {
    const { data: badges } = await api.sendMessage({
      type: 'badges:load',
    }, { userId: user.id });
    const invalid = badges.filter((b) => b.userId !== user.id);
    assert.equal(invalid.length, 0);
  });
});
