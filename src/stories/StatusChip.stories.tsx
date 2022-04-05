import { StatusChip, ChipState } from '@/components/statusChip';
import React from 'react';

export default {
  title: 'Atoms/Status Chip',
  component: StatusChip,
  argTypes: {
    status: {
      options: [
        ChipState.SUCCESS,
        ChipState.PENDING,
        ChipState.ACTION_REQUIRED
      ],
      control: { type: 'select' }
    }
  }
};

const Template = (args) => <StatusChip {...args} />;

export const Success = Template.bind({});
Success.args = {
  status: ChipState.SUCCESS
};

export const Pending = Template.bind({});
Pending.args = {
  status: ChipState.PENDING
};

export const ActionRequired = Template.bind({});
ActionRequired.args = {
  status: ChipState.ACTION_REQUIRED
};
