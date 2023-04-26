const { TranslationServiceClient } = require('@google-cloud/translate');

// Instantiates a client
const translationClient = new TranslationServiceClient();

const projectId = 'codecat-161113';
const location = 'global';
const text = 'Hello, world!';

async function translateText() {
  // Construct request
  const request = {
    parent: `projects/${projectId}/locations/${location}`,
    contents: [text],
    mimeType: 'text/plain', // mime types: text/plain, text/html
    sourceLanguageCode: 'en',
    targetLanguageCode: 'es',
  };

  // Run request
  const [response] = await translationClient.translateText(request);

  for (const translation of response.translations) {
    console.log(`Translation: ${translation.translatedText}`);
  }
}

translateText();
