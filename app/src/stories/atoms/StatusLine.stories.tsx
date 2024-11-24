import type { Meta, StoryObj } from '@storybook/react';
 
import '../../styles.ts';
import { StatusLine } from '../../js/components/atoms/StatusLine';
import { store, actions } from '../../js/store';

const meta: Meta<typeof StatusLine> = {
  component: StatusLine,
  loaders: [async () => {
    console.log('loading');
    store.dispatch(actions.users.add({ id: '1', name: 'Alice' }));
    store.dispatch(actions.typing.add({ channelId: 'main', userId: '1' }));

  }],
};
 
export default meta;
type Story = StoryObj<typeof StatusLine>;
 
export const Primary: Story = {
  args: {
    channelId: 'main',
  },
};
