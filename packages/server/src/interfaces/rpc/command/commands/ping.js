const crypto = require('crypto');

module.exports = {
  name: 'ping',
  description: 'sends ping on channel from thread',
  args: [],
  handler: async (req, res, {repo}) => {
    const { channelId, parentId } = req.body.context;
    if (!parentId) {
      throw new Error('No parent message');
    }
    const parent = await repo.message.get({ id: parentId });
    if (!parent) {
      throw new Error('Parent message not found');
    }
    const channel = await repo.channel.get({ id: channelId });
    // FIXME: check permissions

    const lines = parent.flat.split('\n');
    const { id } = await createMessage({
      clientId: crypto.randomBytes(16).toString('hex'),
      message: [{
        line: [{ text: '[PING] from ' }, { thread: { channelId, parentId, text: lines[0] + (lines.length >= 2 ? '...' : '') } }],
      }],
      flat: '[PING] from thread',
      channelId,
      channel: channel.cid,
      userId: req.userId,
      updatedAt: new Date(),
      createdAt: new Date(),
    });
    const msg = await repo.message.get({ id });
    await res.broadcast({ type: 'message', ...msg });
    return res.ok();
  },
};

async function createMessage(msg) {
  const data = Object.fromEntries(Object.entries(msg).filter(([, v]) => v !== undefined));
  let id; let
    dup = false;
  try {
    (id = await repo.message.create(data));
  } catch (err) {
    if (err.code !== 11000) {
      throw err;
    }
    dup = true;
  }
  return { id, dup };
}
