const { getLinkPreview } = require('link-preview-js');
const repo = require('../../infra/repositories');

module.exports = {
  addPreview: async ({ messageId, links }, { bus }) => {
    try {
      const data = await Promise.all(links.map((link) => getLinkPreview(link)));
      await repo.message.update({ id: messageId }, { linkPreviews: data });
      const updated = await repo.message.get({ id: messageId });
      await bus.broadcast({ type: 'message', ...updated });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  },
};
