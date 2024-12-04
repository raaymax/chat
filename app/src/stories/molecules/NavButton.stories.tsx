import type { Meta, StoryObj } from '@storybook/react';
 
import '../../styles.ts';
import { NavButton } from '../../js/components/molecules/NavButton';

const meta: Meta<typeof NavButton> = {
  component: NavButton,
};
 
export default meta;
type Story = StoryObj<typeof NavButton>;
 
export const Primary: Story = {
  args: {
    children: 'NavButton',
    icon: 'hash',
  },
};