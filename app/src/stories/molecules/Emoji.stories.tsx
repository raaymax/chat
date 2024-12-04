import type { Meta, StoryObj } from '@storybook/react';
 
import '../../styles.ts';
import { Emoji } from '../../js/components/molecules/Emoji';
import { store, methods } from '../../js/store';

const meta: Meta<typeof Emoji> = {
  component: Emoji,
  loaders: [async () => {
    store.dispatch(methods.emojis.load({}));
  }],
};
 
export default meta;
type Story = StoryObj<typeof Emoji>;
 
export const Primary: Story = {
  args: {
    shortname: ':smile:',
    size: 50
  },
};
