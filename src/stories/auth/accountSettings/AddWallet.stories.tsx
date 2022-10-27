import AddWallet from '@/features/auth/components/settings/AddWallet';
import React from 'react';

export default {
  title: '2. Atoms/Buttons/Text Button',
  argTypes: {
    handleAddWallet: {
      action: 'Action Add Wallet'
    }
  }
};

const Template = (args: any) => <AddWallet {...args} />;

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
Default.args = {};
