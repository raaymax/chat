const repo = require('../../infra/repositories');
const openai = require('../../infra/openai');
const channel = require('../common/channel');
const { AccessDenied } = require('../common/errors');

module.exports = {
  name: 'prompt',
  description: 'prompt OpenAI',
  args: 'text',
  handler: async (req, res) => {
    if (!await channel.haveAccess(req.userId, req.body.context.channelId)) {
      throw AccessDenied();
    }
    res.ok();
    const user = await repo.user.get({ id: req.userId });
    const prompt = req.body.args.join(' ');

    const args = {
      prompt,
      temperature: 0.7,
      max_tokens: 256,
    };

    const { data } = await openai.createCompletion('text-davinci-003', args);

    const openaiUser = await repo.user.get({ login: 'openai' });
    const resp = {
      userId: openaiUser.id,
      message: [
        {
          line: [
            { bold: { text: user.name } },
            { text: ' asked: "' },
            { italic: { text: prompt } },
            { text: '"' }],
        },
        ...data.choices[0].text.split('\n').map((line) => ({
          line: { text: line },
        })).filter((l) => !!l.line.text),
      ],
      metadata: {
        openai: {
          request: {
            model: 'text-davinci-002',
            ...args,
          },
          response: data,
        },
      },
      flat: `${prompt}: ${data.choices[0].text}`,
      createdAt: new Date(),
      channelId: req.body.context.channelId,
      clientId: `ai:${Math.random()}`,
    };
    const id = await repo.message.insert(resp);
    const created = await repo.message.get({ id });
    res.broadcast({ type: 'message', ...created });
    res.push.send(created);
  },
};
/*
const { Configuration, OpenAIApi } = require('openai');
const { messageRepo } = require('../database/db');
const Errors = require('../errors');
const config = require('../../../../config');

function initAI() {
  if (config.openaiApiKey) {
    const configuration = new Configuration({
      apiKey: config.openaiApiKey,
    });
    const openai = new OpenAIApi(configuration);
    return {
      prompt: async (self, msg) => {
        if (!self.user) return msg.error(Errors.AccessDenied());
        await msg.ok();

        const prompt = msg.flat.replace(/^\/prompt /, '');

        const args = {
          prompt,
          temperature: 0.7,
          max_tokens: 256,
        };

        const { data } = await openai.createCompletion('text-davinci-002', args);
        const resp = {
          userId: 'openai',
          user: {
            id: 'openai',
            name: 'OpenAI',
            avatarUrl: '/assets/openai.png',
          },
          message: [
            {
              line: [
                { bold: { text: msg.user.name } },
                { text: ' asked: "' },
                { italic: { text: prompt } },
                { text: '"' }],
            },
            ...data.choices[0].text.split('\n').map((line) => ({
              line: { text: line },
            })).filter((l) => !!l.line.text),
          ],
          metadata: {
            openai: {
              request: {
                model: 'text-davinci-002',
                ...args,
              },
              response: data,
            },
          },
          flat: `${prompt}: ${data.choices[0].text}`,
          createdAt: new Date(),
          channel: msg.channel,
        };
        const { id } = await messageRepo.insert(resp);
        resp.id = id;
        await self.broadcast(resp);
      },
    };
  }
  return {
    prompt: (self, msg) => { msg.error(Errors.FeatureNotEnabled()); },
  };
}
module.exports = initAI();
*/
