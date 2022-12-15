import { StatusChip, Status } from '@/components/statusChip';
import React from 'react';

export default {
  title: '2. Atoms/Status Chip',
  component: StatusChip,
  argTypes: {
    status: {
      options: [Status.SUCCESS, Status.PENDING, Status.ACTION_REQUIRED],
      control: { type: 'select' }
    }
  }
};

const Template = (args: any) => <StatusChip {...args} />;

export const Success = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Success.args = {
  status: Status.SUCCESS
};

export const Pending = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Pending.args = {
  status: Status.PENDING
};

export const ActionRequired = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
ActionRequired.args = {
  status: Status.ACTION_REQUIRED
};
