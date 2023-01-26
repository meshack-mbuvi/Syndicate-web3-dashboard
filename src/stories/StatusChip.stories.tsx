import { StatusChip } from '@/components/statusChip';
import { DealStatus, ParticipantStatus } from '@/hooks/deals/types';
import React from 'react';

export default {
  title: '2. Atoms/Status Chip',
  component: StatusChip,
  argTypes: {
    status: {
      options: [
        DealStatus.CLOSED,
        ParticipantStatus.PENDING,
        ParticipantStatus.ACTION_REQUIRED
      ],
      control: { type: 'select' }
    }
  }
};

const Template = (args: any) => <StatusChip {...args} />;

export const Success = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Success.args = {
  status: DealStatus.CLOSED
};

export const Pending = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Pending.args = {
  status: ParticipantStatus.PENDING
};

export const ActionRequired = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
ActionRequired.args = {
  status: ParticipantStatus.ACTION_REQUIRED
};
