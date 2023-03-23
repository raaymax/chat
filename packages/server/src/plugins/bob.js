const bus = require('../infra/bus');
const db = require('../infra/database');
const push = require('../infra/push');
const openai = require('../infra/openai');

bus.on('openai', async (msg) => {
  return;
  const author = await db.user.get({ id: msg.userId });
  if (!author) return;
  if (msg.type !== 'message' || author.login === 'bob') return;
  const channel = await db.channel.get({ id: msg.channelId });
  if (channel.cid !== 'openai' && !channel.cid.startsWith('bob+')) return;

  const messages = await db.message.getAll({
    channelId: msg.channelId,
    after: new Date(Date.now() - 1000 * 60 * 10),
  }, {
    limit: 10,
  });
  const conversation = messages.map((m) => ({
    who: m.userId === 'openai' ? 'Bob' : 'Me',
    flat: m.flat,
  })).map(({ who, flat }) => `${who}: ${flat}`).reverse().join('\n');

  const prompt = 'The following conversation between me and my best friend Bob, we know each other from ages. Bob likes to ask a lot of questions.\n\n'
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
    const user = await db.user.get({ login: 'bob' });

    const resp = {
      userId: user.id,
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
      channelId: msg.channelId,
      clientId: `ai:${Math.random()}`,
    };

    const { id } = await db.message.insert(resp);
    const created = await db.message.get({ id });
    bus.broadcast({ type: 'message', ...created });
    push.send(created);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
});
