
const { Configuration, OpenAIApi } = require('openai');
const { messageRepo } = require('../database/db');
const Errors = require('../errors');
const config = require('../../../../chat.config');

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
