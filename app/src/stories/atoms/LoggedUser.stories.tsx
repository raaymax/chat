import type { Meta, StoryObj } from '@storybook/react';
 
import '../../styles.ts';
import { LoggedUser } from '../../js/components/atoms/LoggedUser.tsx';
import { UserProvider } from '../../js/components/contexts/user.tsx';
import { store, actions } from '../../js/store/store.ts';


const meta: Meta<typeof LoggedUser> = {
  component: LoggedUser,
  decorators: [
    (Story) => (
      <UserProvider value="1">
        <Story />
      </UserProvider>
    ),
  ],
  loaders: [async () => {
    store.dispatch(actions.users.add({ id: '1', name: 'John Doe' }));
  }],
};
 
export default meta;
type Story = StoryObj<typeof LoggedUser>;
 
export const Primary: Story = {
  args: {
  },
};
