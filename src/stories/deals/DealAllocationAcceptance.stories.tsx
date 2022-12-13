import React from 'react';
import UponAllocationAcceptance from '@/features/deals/components/details/uponAllocationAcceptance';

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
  dealTokenSymbol: 'PRVX'
};
