const { channelRepo } = require('../infra/database');

module.exports = async (req, res) => {
  const channels = await channelRepo.getAll({ userId: req.userId });
  channels.forEach((channel) => {
    res.send({ type: 'channel', channel });
  });
  res.ok();
};
