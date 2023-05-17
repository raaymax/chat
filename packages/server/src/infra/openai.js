const { Configuration, OpenAIApi } = require('openai');
const config = require('../../../../config');

let openai = { createCompletion: () => Promise.resolve('OpenAI is disabled') };
if (config.openaiApiKey) {
  const configuration = new Configuration({
    apiKey: config.openaiApiKey,
  });
  openai = new OpenAIApi(configuration);
}

module.exports = openai;
