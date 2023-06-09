const assert = require('assert');
const api = require('../../actions/tests/api');

describe('/leave', () => {
  let user;
  let otherUser;

  before(async () => {
    user = await api.repo.user.get({ login: 'admin' });
    otherUser = await api.repo.user.get({ login: 'member' });
  });

  it('should change users avatar and infor about change', async () => {
    const channelId = await api.repo.channel.create({ channelType: 'DIRECT', users: [user.id, otherUser.id], name: 'test' });
    const { res } = await api.sendMessage({
      type: 'command:execute',
      name: 'leave',
      args: [],
      context: {
        channelId,
      },
      attachments: [{ id: '123', fileName: 'avatar.jpg' }],
    }, { userId: user.id });
    assert.equal(res.status, 'error');
  });
});
