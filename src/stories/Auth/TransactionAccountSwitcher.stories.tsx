import TransactionWalletSwitcher from '@/features/auth/components/walletSwitching/transactionWalletSwitcher';
import React from 'react';

export default {
  title: 'Molecules/Auth/Transaction Wallet Switcher',
  decorators: [
    (Story: any): React.ReactElement => (
      <div style={{ margin: '0rem' }}>
        <Story />
      </div>
    )
  ]
};

const Template = (args: any) => <TransactionWalletSwitcher {...args} />;

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Default.args = {
  address: '0x53054ce1654064dDbf3C7B190e5255B0cE41b49F',
  image: '/images/jazzicon.png',
  ens: 'first.eth'
};
