import type { Meta, StoryObj } from '@storybook/react';
 
import '../../styles.ts';
import { NavUsers } from '../../js/components/molecules/NavUsers';
import { store, actions } from '../../js/store';

const meta: Meta<typeof NavUsers> = {
  component: NavUsers,
  loaders: [async () => {
    store.dispatch(actions.me.set('me'));
    store.dispatch(actions.users.add({ id: 'me', name: 'John Doe' }));
    store.dispatch(actions.users.add({ id: 'him', name: 'Jack James' }));
    store.dispatch(actions.users.add({ id: 'she', name: 'Lindsay Smith' }));
    store.dispatch(actions.channels.add({ id: 'channelId', name: 'SuperChannel', users: ['me'], channelType: 'PUBLIC' }));
    store.dispatch(actions.channels.add({ id: 'channelId2', name: 'CoolThings', users: ['me'], channelType: 'PUBLIC' }));
  }],
};
 
export default meta;
type Story = StoryObj<typeof NavUsers>;
 
export const Primary: Story = {
  args: {
  },
};
