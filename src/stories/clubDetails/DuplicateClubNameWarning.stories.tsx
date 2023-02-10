import React from 'react';
import DuplicateClubWarning from '@/components/syndicates/shared/DuplicateClubWarning';

export default {
  title: 'Molecules/Investment Clubs/Duplicate club warning',
  component: DuplicateClubWarning
};

const Template = (args: any) => <DuplicateClubWarning {...args} />;

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Default.args = {
  dismissDuplicateClubWarning: function dismiss(): void {
    return;
  }
};
