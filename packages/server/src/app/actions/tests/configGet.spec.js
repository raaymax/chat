const assert = require('assert');
const api = require('./api');
const pack = require('../../../../package.json');

describe('config:get', () => {
  let user;

  before(async () => {
    user = await api.repo.user.get({ name: 'Admin' });
  });

  it('should return app configuration', async () => {
    await api.repo.user.update({ id: user.id }, { mainChannelId: null });
    const { res, data: [config] } = await api.sendMessage({ type: 'config:get' }, { userId: user.id });
    assert.equal(res.type, 'response');
    assert.equal(res.status, 'ok');
    assert.equal(config.appVersion, pack.version);
    const channel = await api.repo.channel.get({ id: config.mainChannelId });
    assert.equal(channel.name, 'Admin');
  });

  it('should return main channel id selected by user', async () => {
    const channel = await api.repo.channel.get({ name: 'main' });
    await api.repo.user.update({ id: user.id }, { mainChannelId: channel.id });
    const { res, data: [config] } = await api.sendMessage({ type: 'config:get' }, { userId: user.id });
    assert.equal(res.type, 'response');
    assert.equal(res.status, 'ok');
    assert.equal(config.appVersion, pack.version);
    const main = await api.repo.channel.get({ id: config.mainChannelId });
    assert.equal(main.name, 'main');
  });
});
