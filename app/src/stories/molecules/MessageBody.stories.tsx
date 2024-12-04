import type { Meta, StoryObj } from '@storybook/react';
 
import '../../styles.ts';
import { MessageBody } from '../../js/components/molecules/MessageBody';

const meta: Meta<typeof MessageBody> = {
  component: MessageBody,
};
 
export default meta;
type Story = StoryObj<typeof MessageBody>;
 
export const Primary: Story = {
  args: {
  },
};
