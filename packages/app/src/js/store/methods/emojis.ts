import {createMethod} from '../store';
import {EmojiDescriptor} from '../../types';

export const load = createMethod('emojis/load', async (_arg, {actions, client, dispatch}) => {
  const [baseEmojis, { data }] = await Promise.all([
    import('../../../assets/emoji_list.json'),
    client.req({ type: 'emoji:getAll' }),
  ]);
  const emojis = data as EmojiDescriptor[];
  dispatch(actions.emojis.add(baseEmojis.default));
  dispatch(actions.emojis.add(emojis.map((e) => ({...e, category: 'c'}))));
  dispatch(actions.emojis.ready());
});

export const find = createMethod('emojis/find', async (shortname: string, {actions, client, dispatch}) => {
  try {
    const { data: [emoji] } = await client.req({ type: 'emoji:get', shortname });
    if (emoji) dispatch(actions.emojis.add(emoji));
  } catch (err) {
    // ignore
  }
});
