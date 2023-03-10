const pack = require('../../../package.json');

module.exports = {
  name: 'version',
  description: 'displays app verions',
  args: [],
  handler: async (req, res) => {
    const { appVersion } = req.body.context;
    await res.systemMessage([
      { line: { text: `Server version: ${pack.version}` } },
      { line: { text: `App version: ${appVersion}` } },
    ]);
    return res.ok();
  },
};
