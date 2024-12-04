import type { Meta, StoryObj } from '@storybook/react';
 
import '../../styles.ts';
import { ChannelLink } from '../../js/components/molecules/ChannelLink';
import { store, actions } from '../../js/store';

const meta: Meta<typeof ChannelLink> = {
  component: ChannelLink,
  loaders: [async () => {
    store.dispatch(actions.channels.add({ id: 'channelId', name: 'SuperChannel', users: [], channelType: 'PUBLIC' }));
  }],
};
 
export default meta;
type Story = StoryObj<typeof ChannelLink>;
 
export const Primary: Story = {
  args: {
    channelId: 'channelId',
  },
};
