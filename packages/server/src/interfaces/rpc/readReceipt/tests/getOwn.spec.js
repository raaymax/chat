const assert = require('assert');
const api = require('../../tests/api');

describe('readReceipt:getOwn', () => {
  let user;

  before(async () => {
    user = await api.repo.user.get({ login: 'admin' });
  });
  after(async () => {
    await api.repo.close();
  });

  it('should return list of badges', async () => {
    const { data: badges } = await api.sendMessage({
      type: 'readReceipt:getOwn',
    }, { userId: user.id });
    const invalid = badges.filter((b) => b.userId !== user.id);
    assert.equal(invalid.length, 0);
  });
});
