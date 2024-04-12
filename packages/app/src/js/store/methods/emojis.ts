import {createMethod} from '../store';

export const load = createMethod('emojis/load', async (_arg, {actions, client}) => {
  const [baseEmojis, { data: emojis }] = await Promise.all([
    import('../../../assets/emoji_list.json'),
    client.req({ type: 'emoji:getAll' }),
  ]);
  actions.emojis.add(baseEmojis.default);
  actions.emojis.add(emojis.map((e: any) => ({...e, category: 'c'})));
  actions.emojis.ready({});
});

export const find = createMethod('emojis/find', async (shortname: string, {actions, client}) => {
  try {
    const { data: [emoji] } = await client.req({ type: 'emoji:get', shortname });
    if (emoji) actions.emojis.add(emoji);
  } catch (err) {
    // ignore
  }
});
