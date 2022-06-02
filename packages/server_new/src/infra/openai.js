const { Configuration, OpenAIApi } = require('openai');
const Errors = require('../errors');
const config = require('../../../../chat.config');

function initAI() {
  if (config.openaiApiKey) {
    const configuration = new Configuration({
      apiKey: config.openaiApiKey,
    });
    const openai = new OpenAIApi(configuration);
    return {
      prompt: async (prompt) => {
        const args = {
          prompt,
          temperature: 0.7,
          max_tokens: 256,
        };

        const { data } = await openai.createCompletion('text-davinci-002', args);
        return data;
      },
    };
  }
  return {
    prompt: () => { throw Errors.FeatureNotEnabled(); },
  };
}
module.exports = initAI();
