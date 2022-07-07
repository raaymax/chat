const { messageRepo } = require('../infra/database');
const {
  MissingChannel, MissingMessage, MissingFlat, AccessDenied,
} = require('../common/errors');
const push = require('../infra/push');
const channel = require('../common/channel');

module.exports = async (req, res) => {
  const msg = req.body;

  if (!msg.message) throw MissingMessage();
  if (!msg.channel) throw MissingChannel();
  if (typeof msg.flat !== 'string') throw MissingFlat();

  if (!await channel.haveAccess(req.userId, msg.channel)) {
    throw AccessDenied();
  }

  const { id, dup } = await createMessage({
    message: msg.message,
    channel: msg.channel,
    clientId: msg.clientId,
    userId: msg.userId,
    attachments: msg.attachments?.map((file) => ({
      id: file.id,
      fileName: file.fileName,
      contentType: file.contentType,
    })),
    createdAt: new Date(),
  });
  const created = await messageRepo.get({ id });

  if (!dup) {
    res.broadcast({ type: 'message', ...created });
    push.send(created);
  }
  res.ok(dup ? { duplicate: true } : {});
};

async function createMessage(msg) {
  let id; let
    dup = false;
  try {
    id = await messageRepo.insert(msg);
  } catch (err) {
    if (err.code !== 11000) {
      throw err;
    }
    dup = true;
  }
  return { id, dup };
}
