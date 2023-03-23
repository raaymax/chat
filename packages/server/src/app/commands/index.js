/* eslint-disable no-nested-ternary */
/* eslint-disable global-require */
const db = require('../../infra/database');

const commands = [
  require('./avatar'),
  require('./name'),
  require('./me'),
  require('./prompt'),
  require('./version'),
  require('./emoji'),
  require('./ping'),
  require('./leave'),
  require('./join'),
];

module.exports = async (req, res) => {
  res.systemMessage = async (msg) => {
    const { channelId } = req.body.context || {};
    await res.send({
      type: 'message',
      id: `sys:${Math.random().toString(10)}`,
      userId: (await db.user.get({ name: 'System' })).id,
      priv: true,
      message: msg,
      channelId,
      createdAt: new Date().toISOString(),
    });
  };
  const { name } = req.body;
  if (name === 'help') return sendHelp(req, res);
  const command = commands.find((cmd) => cmd.name === name);
  if (!command) return unknownCommand(req, res);
  return command.handler(req, res);
};

async function sendHelp(req, res) {
  const help = commands.filter((h) => !h.hidden).map((h) => [
    { bold: { text: `/${h.name}` } },
    {
      text: `${
        Array.isArray(h.args) ? ` ${h.args.map((a) => `<${a}>`).join(' ')}` : (h.args ? ` <${h.args}>` : '')
      }${h.description ? ` - ${h.description}` : ''}`,
    },
    { br: true },
  ]).flat();

  await res.systemMessage(help);

  return res.ok();
}

function unknownCommand() {
  // TODO test this case?
  throw new Error('UNKNOWN_COMMAND');
}
