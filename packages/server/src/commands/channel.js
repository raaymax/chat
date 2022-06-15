module.exports = {
  name: 'channel',
  description: 'to change channel',
  args: ['name'],
  handler: async (req, res) => {
    res.send({
      type: 'setChannel',
      channel: req.body.args[0],
    });
    return res.ok();
  },
};
