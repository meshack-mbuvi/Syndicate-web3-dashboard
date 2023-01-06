import { DealsOverviewSuccess } from '@/features/deals/components/create/success';

export default {
  title: '4. Organisms/Deals/Create/Complete'
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const Template = (args: any) => {
  return <DealsOverviewSuccess {...args} />;
};

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
Default.args = {
  dealName: 'Privax Seed',
  dealDetails:
    'Seed round for a zk-identity startup. This will roll up all participants to invest in a privacy focused identity startup called Privax utilizing zero-knowledge shell proofs to allow users to manage their own anonymity.',
  ensName: 'johndoe.eth',
  destinationAddress: '0x432D982D28942',
  commitmentGoalAmount: '10,000',
  commitmentGoalTokenSymbol: 'USDC',
  commitmentGoalTokenLogo: '/images/prodTokenLogos/USDCoin.svg',
  dealURL: 'https://storybook.syndicate.io'
};
