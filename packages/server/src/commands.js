/* eslint-disable no-nested-ternary, prefer-template */
const userController = require('./user/userController');
const channelsController = require('./channel/channelController');
const aiController = require('./ai/aiController');
const Errors = require('./errors');
const msgFactory = require('./message/messageFactory');

const handlers = {};
const execute = (name, ...args) => (handlers[name] || handlers['*']).handler(...args);
const cmd = (name, desc) => {
  handlers[name] = { ...desc, name };
};

cmd('help', {
  description: 'display this help',
  handler: sendHelp,
});
cmd('name', {
  description: 'change username',
  args: ['name'],
  handler: userController.changeName,
});
cmd('avatar', {
  description: 'to change your avatar',
  args: ['url'],
  handler: userController.changeAvatar,
});
cmd('login', {
  group: 'auth',
  description: 'login to your account',
  args: ['name', 'password'],
  handler: userController.login,
});
cmd('channel', {
  description: 'change current channel',
  args: ['name'],
  handler: channelsController.changeChannel,
});
cmd('ai', {
  description: 'ask openai GPT-3',
  args: 'text',
  handler: aiController.ai,
});
cmd('prompt', {
  description: 'ask openai GPT-3 - without default prompt',
  args: 'text',
  handler: aiController.prompt,
});
cmd('join', {
  description: 'join current channel',
  handler: channelsController.join,
});
cmd('leave', {
  description: 'leave current channel',
  handler: channelsController.leave,
});
cmd('logout', {
  description: 'logout from your account',
  handler: userController.logout,
});
cmd('me', {
  description: 'display user info',
  handler: userController.me,
});
cmd('*', {
  hidden: true,
  handler: unknownCommand,
});

module.exports = async (self, msg) => execute(msg.cmd, self, msg);

async function sendHelp(self, msg) {
  const help = Object.values(handlers).filter((h) => !h.hidden).map((h) => [
    { bold: { text: `/${h.name}` } },
    {
      text: ''
        + (Array.isArray(h.args) ? ` ${h.args.map((a) => `<${a}>`).join(' ')}` : (h.args ? ` <${h.args}>` : ''))
        + (h.description ? ` - ${h.description}` : ''),
    },
    { br: true },
  ]).flat();

  await self.send(msgFactory.createSystemMessage({
    id: 'help',
    seqId: msg.seqId,
    message: help,
  }));

  return msg.ok();
}

function unknownCommand(_self, msg) {
  return msg.error(Errors.UnknownCommand(msg.cmd));
}
