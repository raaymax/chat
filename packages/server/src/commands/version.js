const pack = require('../../package.json');

module.exports = {
  name: 'version',
  description: 'displays app verions',
  args: [],
  handler: async (req, res) => {
    const { appVersion, channel } = req.body.context;
    await res.send({
      type: 'message',
      id: 'help',
      userId: 'system',
      priv: true,
      message: [
        { line: { text: `Server version: ${pack.version}` } },
        { line: { text: `App version: ${appVersion}` } },
      ],
      channel,
      createdAt: new Date().toISOString(),
    });
    return res.ok();
  },
};
