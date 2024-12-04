import type { Meta, StoryObj } from '@storybook/react';
 
import '../../styles.ts';
import { ReadReceipt } from '../../js/components/molecules/ReadReceipt';

const meta: Meta<typeof ReadReceipt> = {
  component: ReadReceipt,
};
 
export default meta;
type Story = StoryObj<typeof ReadReceipt>;
 
export const Primary: Story = {
  args: {
    data: [
      { userId: '1', user: {avatarUrl: 'https://picsum.photos/32', name: 'John Doe'} },
      { userId: '2', user: {avatarUrl: 'https://picsum.photos/32', name: 'Johnny Silverhand'} },
      { userId: '3', user: {avatarUrl: 'https://picsum.photos/32', name: 'Berta Brown'} },
    ]

  },
};
