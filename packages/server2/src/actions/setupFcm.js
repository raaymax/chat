const { MissingToken } = require('../common/errors');

module.exports = async (req, res) => {
  const msg = req.body;
  if (!msg.token) throw MissingToken();

  req.session.fcmToken = msg.token;
  await req.session.save();

  return res.ok();
  
}
