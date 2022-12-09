import { DealsAllocations } from '@/features/deals/components/allocations';

export default {
  title: '4. Organisms/Deals/Allocations'
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const Template = (args: any) => {
  return <DealsAllocations {...args} />;
};

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
Default.args = {
  leaderEnsName: 'john.eth',
  leaderAddress: '0xDFS98SDFS98',
  numberOfParticipants: 6,
  totalAllocatedAmount: 56000,
  tokenSymbol: 'USDC',
  tokenIcon: '/images/prodTokenLogos/USDCoin.svg',
  dealEndTime: 1645092424000
};
