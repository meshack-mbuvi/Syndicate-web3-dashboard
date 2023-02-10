import DealPrecommitCompleteModal from '@/features/deals/components/precommit/completeModal';

export default {
  title: 'Organisms/Deals/Precommit/Complete'
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const Template = (args: any) => {
  return <DealPrecommitCompleteModal {...args} />;
};

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
Default.args = {
  dealName: 'Privax Seed',
  dealTokenSymbol: 'PRVX',
  tokenAmount: 3000,
  tokenLogo: '/images/prodTokenLogos/USDCoin.svg',
  tokenSymbol: 'USDC',
  address: '0xJKNFSDDFSDF94DS',
  ensName: 'alex.eth'
};
