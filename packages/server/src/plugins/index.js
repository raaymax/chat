const bus = require('../infra/ws');
const { messageRepo } = require('../infra/database');
const push = require('../infra/push');
const openai = require('../infra/openai');

bus.on('openai', async (msg) => {
  if (msg.type !== 'message' || msg.channel !== 'openai' || msg.userId === 'bob') return;

  const messages = await messageRepo.getAll({
    channel: msg.channel,
    after: new Date(Date.now() - 1000 * 60 * 10),
  }, {
    limit: 10,
  });
  const conversation = messages.map((m) => ({
    who: m.userId === 'openai' ? 'Bob' : 'Me',
    flat: m.flat,
  })).map(({ who, flat }) => `${who}: ${flat}`).reverse().join('\n');

  const prompt = 'The following conversation between me and my best friend Bob, we know each other from ages.\n\n'
    + 'Me: Hello, who are you?\n'
    + 'Bob: Fine, and you?\n'
    + `${conversation}\n`
    + 'Bob:';

  const args = {
    prompt,
    temperature: 0.7,
    max_tokens: 256,
    stop: ['Me:', 'Bob:'],
  };

  try {
    const { data } = await openai.createCompletion('text-davinci-002', args);

    const resp = {
      userId: 'bob',
      message: [
        ...data.choices[0].text.trim().split('\n').map((line) => ({
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
      flat: data.choices[0].text.trim(),
      createdAt: new Date(),
      channel: msg.channel,
      clientId: `ai:${Math.random()}`,
    };

    const { id } = await messageRepo.insert(resp);
    const created = await messageRepo.get({ id });
    bus.broadcast({ type: 'message', ...created });
    push.send(created);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
});
