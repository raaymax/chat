const repo = require('../repository');

module.exports = {
  nextId: async ({ channelId, parentId }) => {
    const key = `${channelId}:${parentId || 'null'}`;
    const idx = await repo.streamIndex.get({ id: key });
    if (!idx) {
      await repo.streamIndex.create({ id: key, idx: 1 });
      return 1;
    }
    const nextIdx = idx.idx + 1;
    await repo.streamIndex.update({ id: key }, { idx: nextIdx });
    return nextIdx;
  },
};
