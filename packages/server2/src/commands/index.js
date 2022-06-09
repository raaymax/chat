const commands = [
  require('./avatar'),
  require('./name'),
  require('./join'),
  require('./leave'),
];

module.exports = async (req, res) => {
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

  await res.send({
    type: 'message',
    id: 'help',
    userId: 'system',
    priv: true,
    message: help,
    createdAt: new Date().toISOString(),
  });

  return res.ok();
}

function unknownCommand(req, res) {
  return new Error('UNKNOWN_COMMAND');
}
