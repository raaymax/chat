const { emojiRepo } = require('../infra/database');

module.exports = {
  name: 'emoji',
  description: 'defines emoji, name should be in :your_name: form',
  args: ['name'],
  attachments: ['image'],
  handler: async (req, res) => {
    const [name] = req.body.args;
    const shortname = `:${name}:`;
    if (!shortname.match(/^:[a-zA-Z0-9_-]+:$/)) {
      throw new Error('Invalid emoji name');
    }
    const [{id}] = req.body.attachments;
    await emojiRepo.insert({ shortname, fileId: id });
    res.broadcast({ type: 'emoji', shortname, fileId: id });
    return res.ok();
  },
};
