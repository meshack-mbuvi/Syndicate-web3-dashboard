import React from 'react';
import DealAccountSwitcher from '@/features/deals/components/details/dealAccountSwitcher';

export default {
  title: 'Organisms/Deals/Details/Deal Account Switcher'
};

const Template = (args: any) => <DealAccountSwitcher {...args} />;

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Default.args = {
  dealCommitTokenSymbol: 'USDC',
  handleAccountSwitch: (account: string): void => {
    console.log(account);
  },
  walletBalance: '27555',
  walletProviderName: 'MetaMask',
  connectedWallet: {
    address: '0x8410B86f3220631D5110a31f966f12C7A4309435',
    name: 'jillo-syndicate.eth',
    avatar: '/images/jazzicon.png'
  },
  wallets: [
    {
      address: '0x8410B86f3220631D5110a31f966f12C7A4309435',
      name: 'first.eth',
      avatar: '/images/jazzicon.png'
    },
    {
      address: '0x8410B86f3220631D5110a31f966f12C7A4309435',
      name: 'second.eth',
      avatar: '/images/jazzicon.png'
    }
  ]
};
