import { InfoActionWrapper } from '@/components/infoActionWrapper';
import React from 'react';

export default {
  title: 'Molecules/Info Action Wrapper',
  argTypes: {
    handleAction: {
      action: 'Action clicked'
    }
  }
};

const Template = (args) => (
  <InfoActionWrapper {...args}>
    <div className="border-dashed border border-gray-syn6 bg-gray-syn8 p-6 text-center uppercase tracking-px font-medium text-sm text-gray-syn5 rounded-custom">
      Element
    </div>
  </InfoActionWrapper>
);
export const Default = Template.bind({});
Default.args = {
  title: 'Airdrop 1 ✺ABC to',
  actionButtonLabel: 'Enter addresses',
  helperText:
    'Invite members by minting & sending the community token to their wallets. You can distribute to more members anytime later. Add multiple addresses at once to minimize airdrop gas fees.',
  customClasses: 'w-80'
};
