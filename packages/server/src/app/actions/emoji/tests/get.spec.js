const assert = require('assert');
const api = require('../../tests/api');

describe('emoji:get', () => {
  let user;

  before(async () => {
    user = await api.repo.user.get({ name: 'Admin' });
    await api.repo.emoji.create({ shortname: 'test', fileId: 'test' });
  });
  after(async () => {
    await api.repo.close();
  });

  it('should return empty emoji for unknown shortname', async () => {
    const { res, data: [emoji] } = await api.sendMessage({ type: 'emoji:get', shortname: 'party_parrot' }, { userId: user.id });
    assert.equal(res.type, 'response');
    assert.equal(res.status, 'ok');
    assert.equal(emoji.type, 'emoji');
    assert.equal(emoji.empty, true);
    assert(!emoji.fileId);
  });

  it('should return test emoji', async () => {
    const { res, data: [emoji] } = await api.sendMessage({ type: 'emoji:get', shortname: 'test' }, { userId: user.id });
    assert.equal(res.type, 'response');
    assert.equal(res.status, 'ok');
    assert.equal(emoji.type, 'emoji');
    assert(emoji.fileId);
  });
});
