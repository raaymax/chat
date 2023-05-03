const assert = require('assert');
const api = require('./api');

describe('emoji:find', () => {
  let user;

  before(async () => {
    user = await api.repo.user.get({ name: 'Admin' });
    await api.repo.emoji.create({ shortname: 'test', fileId: 'test' });
  });

  it('should return empty emoji for unknown shortname', async () => {
    const { res, data: [emoji] } = await api.sendMessage({ type: 'emoji:find', shortname: 'party_parrot' }, { userId: user.id });
    assert.equal(res.type, 'response');
    assert.equal(res.status, 'ok');
    assert.equal(emoji.type, 'emoji');
    assert.equal(emoji.empty, true);
    assert(!emoji.fileId);
  });

  it('should return test emoji', async () => {
    const { res, data: [emoji] } = await api.sendMessage({ type: 'emoji:find', shortname: 'test' }, { userId: user.id });
    assert.equal(res.type, 'response');
    assert.equal(res.status, 'ok');
    assert.equal(emoji.type, 'emoji');
    assert(emoji.fileId);
  });
});
