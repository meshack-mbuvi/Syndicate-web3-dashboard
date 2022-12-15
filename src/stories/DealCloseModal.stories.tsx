import DealCloseModal from '@/features/deals/components/close/execute';

export default {
  title: '4. Organisms/Deals/Close/Execute'
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const Template = (args: any) => {
  return <DealCloseModal {...args} />;
};

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
Default.args = {
  dealName: 'Privax Seed',
  showWaitingOnWalletLoadingState: false,
  tokenLogo: 'images/prodTokenLogos/USDCoin.svg',
  tokenSymbol: 'USDC',
  tokenAmount: 6000,
  destinationEnsName: 'startuphuman.eth',
  destinationAddress: '0xDGFDSFS9F32D3WE'
};

export const Loading = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
Loading.args = {
  dealName: 'Privax Seed',
  showWaitingOnWalletLoadingState: true,
  tokenLogo: 'images/prodTokenLogos/USDCoin.svg',
  tokenSymbol: 'USDC',
  tokenAmount: 6000,
  destinationEnsName: 'startuphuman.eth',
  destinationAddress: '0xDGFDSFS9F32D3WE'
};
