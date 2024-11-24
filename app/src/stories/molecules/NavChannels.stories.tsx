import type { Meta, StoryObj } from '@storybook/react';
 
import '../../styles.ts';
import { NavChannels } from '../../js/components/molecules/NavChannels';
import { store, actions } from '../../js/store';

const meta: Meta<typeof NavChannels> = {
  component: NavChannels,
  loaders: [async () => {
    store.dispatch(actions.me.set('me'));
    store.dispatch(actions.channels.add({ id: 'channelId', name: 'SuperChannel', users: ['me'], channelType: 'PUBLIC' }));
    store.dispatch(actions.channels.add({ id: 'channelId2', name: 'CoolThings', users: ['me'], channelType: 'PUBLIC' }));
    store.dispatch(actions.progress.add({ channelId: 'channelId', userId: 'me', count: 123, parentId: null}));
  }],
};
 
export default meta;
type Story = StoryObj<typeof NavChannels>;
 
export const Primary: Story = {
  args: {
  },
};
