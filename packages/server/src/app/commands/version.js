const pack = require('../../../package.json');

module.exports = {
  name: 'version',
  description: 'displays app verions',
  args: [],
  handler: async (req, res) => {
    const { appVersion, channelId } = req.body.context;
    await res.send({
      type: 'message',
      id: `version:${Math.random().toString(10)}`,
      userId: 'system',
      priv: true,
      message: [
        { line: { text: `Server version: ${pack.version}` } },
        { line: { text: `App version: ${appVersion}` } },
      ],
      channelId,
      createdAt: new Date().toISOString(),
    });
    return res.ok();
  },
};
