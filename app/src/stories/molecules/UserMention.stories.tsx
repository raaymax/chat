import type { Meta, StoryObj } from '@storybook/react';
 
import '../../styles.ts';
import { UserMention } from '../../js/components/molecules/UserMention';
import { store, actions } from '../../js/store';

const meta: Meta<typeof UserMention> = {
  component: UserMention,
  loaders: [async () => {
    store.dispatch(actions.users.add({ id: '123', name: 'John Doe' }));
  }],
};
 
export default meta;
type Story = StoryObj<typeof UserMention>;
 
export const Primary: Story = {
  args: {
    userId: '123',
  },
};
