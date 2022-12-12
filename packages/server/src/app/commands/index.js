/* eslint-disable no-nested-ternary */
/* eslint-disable global-require */

const commands = [
  require('./avatar'),
  require('./name'),
  require('./join'),
  require('./leave'),
  require('./me'),
  require('./channel'),
  require('./prompt'),
  require('./version'),
  require('./emoji'),
];

module.exports = async (req, res) => {
  const { name } = req.body;
  if (name === 'help') return sendHelp(req, res);
  const command = commands.find((cmd) => cmd.name === name);
  if (!command) return unknownCommand(req, res);
  return command.handler(req, res);
};

async function sendHelp(req, res) {
  const { channelId } = req.body.context || {}; // TODO: this should be validated
  const help = commands.filter((h) => !h.hidden).map((h) => [
    { bold: { text: `/${h.name}` } },
    {
      text: `${
        Array.isArray(h.args) ? ` ${h.args.map((a) => `<${a}>`).join(' ')}` : (h.args ? ` <${h.args}>` : '')
      }${h.description ? ` - ${h.description}` : ''}`,
    },
    { br: true },
  ]).flat();

  await res.send({
    type: 'message',
    id: `help:${Math.random().toString(10)}`,
    userId: 'system',
    priv: true,
    message: help,
    channelId,
    createdAt: new Date().toISOString(),
  });

  return res.ok();
}

function unknownCommand() {
  // TODO test this case?
  throw new Error('UNKNOWN_COMMAND');
}
