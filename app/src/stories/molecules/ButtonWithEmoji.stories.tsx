import type { Meta, StoryObj } from '@storybook/react';
 
import '../../styles.ts';
import { ButtonWithEmoji } from '../../js/components/molecules/ButtonWithEmoji';

import { store, methods} from '../../js/store';

const meta: Meta<typeof ButtonWithEmoji> = {
  component: ButtonWithEmoji,
  loaders: [async () => {
    store.dispatch(methods.emojis.load({}));
  }],
};
 
export default meta;
type Story = StoryObj<typeof ButtonWithEmoji>;
 
export const Primary: Story = {
  args: {
    emoji: ":smile:",
    children: "Hello, World!",
  },
};
