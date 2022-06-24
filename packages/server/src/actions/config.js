const pack = require('../../package.json');

module.exports = async (req, res) => {
  await res.send({
    type: 'config',
    appVersion: pack.version,
  });
  await res.ok();
};
