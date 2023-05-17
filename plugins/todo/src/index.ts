import * as manifest from '../manifest.json';

export { manifest };

export const commands = {
  name: 'time',
  description: 'returns server time',
  handler: async (req, res) => {
    await res.systemMessage([
      { text: new Date().toISOString() },
    ]);
    res.ok();
  },
};
