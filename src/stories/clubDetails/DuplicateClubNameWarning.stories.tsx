import React from 'react';
import DuplicateClubWarning from '@/components/syndicates/shared/DuplicateClubWarning';

export default {
  title: '3. Molecules/Club Details/Duplicate club warning',
  component: DuplicateClubWarning
};

const Template = (args) => <DuplicateClubWarning {...args} />;

export const Default = Template.bind({});
Default.args = {
  dismissDuplicateClubWarning: function dismiss(): void {
    return;
  }
};
