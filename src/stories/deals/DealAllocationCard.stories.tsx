import React from 'react';
import { DealAllocationCard } from '@/features/deals/components/details/dealAllocationCard';
import { Status } from '@/components/statusChip';

export default {
  title: '4. Organisms/Deals/Details/Deal Allocation Card'
};

const Template = (args: any) => <DealAllocationCard {...args} />;

export const Default = Template.bind({});
export const Pending = Template.bind({});
export const Accepted = Template.bind({});

// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Default.args = {
  dealCommitTokenLogo: '/images/usdcIcon.svg',
  dealCommitTokenSymbol: 'USDC',
  minimumCommitAmount: '3000',
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
  ],
  allocationStatus: Status.ACTION_REQUIRED
};

// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Pending.args = {
  dealName: 'Privax Seed',
  dealCommitTokenLogo: '/images/usdcIcon.svg',
  dealCommitTokenSymbol: 'USDC',
  minimumCommitAmount: '300000',
  precommitAmount: '30000',
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
  ],
  allocationStatus: Status.PENDING
};

// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Accepted.args = {
  dealName: 'Privax Seed',
  dealCommitTokenLogo: '/images/usdcIcon.svg',
  dealCommitTokenSymbol: 'USDC',
  minimumCommitAmount: '300000',
  precommitAmount: '30000',
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
  ],
  allocationStatus: Status.ACCEPTED
};
