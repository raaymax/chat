const repo = require('../../infra/repositories');

module.exports = {
  nextId: async ({ channelId, parentId }) => {
    const key = `${channelId}:${parentId || 'null'}`;
    const idx = await repo.streamIndex.get({ key });
    if (!idx) {
      await repo.streamIndex.create({ key, idx: 1 });
      return 1;
    }
    const nextIdx = idx.idx + 1;
    await repo.streamIndex.update({ key }, { idx: nextIdx });
    return nextIdx;
  },
};
