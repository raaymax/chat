import type { Meta, StoryObj } from '@storybook/react';
 
import '../../styles.ts';
import { Reactions } from '../../js/components/molecules/Reactions';
import { store, actions } from '../../js/store';

const meta: Meta<typeof Reactions> = {
  component: Reactions,
  loaders: [async () => {
    store.dispatch(actions.users.add({
      id: '1',
      name: 'John Doe',
    }));
    store.dispatch(actions.users.add({
      id: '2',
      name: 'Jane Doe',
    }));
    store.dispatch(actions.users.add({
      id: '3',
      name: 'Jack Daniels',
    }));
    store.dispatch(actions.emojis.add({
      shortname: ':thumbsup:',
      unicode: '1f44d',
    }));
    store.dispatch(actions.emojis.add({
      shortname: ':100:',
      unicode: '1f4af',
    }));
  }],
};
 
export default meta;
type Story = StoryObj<typeof Reactions>;
 
export const Primary: Story = {
  args: {
    reactions: [
      {
        userId: '1',
        reaction: ':thumbsup:',
      },
      {
        userId: '2',
        reaction: ':thumbsup:',
      },
      {
        userId: '3',
        reaction: ':100:',
      },
    ],
  },
};
export const WithAddButton: Story = {
  args: {
    reactions: [
      {
        userId: '1',
        reaction: ':thumbsup:',
      },
      {
        userId: '2',
        reaction: ':thumbsup:',
      },
      {
        userId: '3',
        reaction: ':100:',
      },
    ],
    onClick: () => {},
  },
};
