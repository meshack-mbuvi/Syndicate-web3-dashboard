import React from 'react';
import UponAllocationAcceptance from '@/features/deals/components/details/uponAllocationAcceptance';
import { PrecommitStatus } from '@/hooks/deals/types';

export default {
  title: '4. Organisms/Deals/Details/Deal Allocation Acceptance'
};

const Template = (args: any) => <UponAllocationAcceptance {...args} />;

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Default.args = {
  dealCommitTokenLogo: '/images/usdcIcon.svg',
  dealCommitTokenSymbol: 'USDC',
  dealTokenLogo: '/images/logo.svg',
  dealTokenSymbol: 'PRVX',
  connectedWallet: {
    address: '0x0574DB630bb75DBe4310fbd6eB08Dc47048b6fad',
    avatar: ''
  },
  precommitAmount: '20000',
  dealName: 'Deal Name',
  status: PrecommitStatus.PENDING
};
