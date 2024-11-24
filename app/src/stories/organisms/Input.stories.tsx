import type { Meta, StoryObj } from '@storybook/react';
 
import '../../styles.ts';
import { Input } from '../../js/components/organisms/Input';
import { allModes } from "../../../.storybook/modes.ts";

 
const meta: Meta<typeof Input> = {
  component: Input,
  parameters: {
    chromatic: {
      modes: {
        mobile: allModes["mobile"],
        desktop: allModes["default"],
      },
    },
  },
};
 
export default meta;
type Story = StoryObj<typeof Input>;
 
export const Primary: Story = {
  args: {
    mode: 'default',
    channelId: '123',
  },
  render: (args) => <Input {...args} />,
};
