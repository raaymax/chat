import type { Meta, StoryObj } from '@storybook/react';
 
import '../../styles.ts';
import { MessageHeader } from '../../js/components/atoms/MessageHeader';

const meta: Meta<typeof MessageHeader> = {
  component: MessageHeader,
};
 
export default meta;
type Story = StoryObj<typeof MessageHeader>;
 
export const Primary: Story = {
  args: {
    user: {
      name: 'John Doe',
    },
    createdAt: '2021-08-10T10:00:00Z',
  },
};
