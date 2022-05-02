const { Configuration, OpenAIApi } = require('openai');
const { messageRepo } = require('../database/db');
const Errors = require('../errors');

function initAI() {
  if (process.env.OPENAI_API_KEY) {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    return {
      createCompletion: async (self, msg) => {
        if (!self.user) return msg.error(Errors.AccessDenied());
        await msg.ok();

        const prompt = msg.flat.replace(/^\/ai /, '');
        const fullPrompt = 'The following is a conversation with an AI assistant. '
          + 'The assistant is helpful, creative, clever, and very friendly.\n\n'
          + 'Human: Hello, who are you?\n'
          + 'AI: I am an AI created by OpenAI. How can I help you today?\n'
          + `Human: ${prompt}\n`
          + 'AI:';

        const args = {
          prompt: fullPrompt,
          temperature: 0.9,
          max_tokens: 256,
          stop: ['Human:', 'AI:'],
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
    createCompletion: (self, msg) => { msg.error(Errors.FeatureNotEnabled()); },
  };
}
module.exports = initAI();
