import DealCloseModal from '@/features/deals/components/close/execute';
import { DealEndType } from '@/features/deals/components/close/types';

export default {
  title: 'Organisms/Deals/Close/Withdraw'
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const Template = (args: any) => {
  return (
    <DealCloseModal
      {...args}
      handleDealCloseClick={() => {
        alert('Clicked close or dissolve deal');
      }}
    />
  );
};

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
Default.args = {
  show: true,
  dealName: 'Privax Seed',
  showWaitingOnWalletLoadingState: false,
  tokenLogo: 'images/prodTokenLogos/USDCoin.svg',
  tokenSymbol: 'USDC',
  tokenAmount: 6000,
  address: '0x8410B86f3220631D5110a31f966f12C7A4309435',
  ensName: 'first.eth',
  ensImage: '/images/jazzicon.png',
  destinationEnsName: 'startuphuman.eth',
  destinationAddress: '0xDGFDSFS9F32D3WE',
  closeType: DealEndType.WITHDRAW
};

export const Loading = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
Loading.args = {
  show: true,
  dealName: 'Privax Seed',
  showWaitingOnWalletLoadingState: true,
  tokenLogo: 'images/prodTokenLogos/USDCoin.svg',
  tokenSymbol: 'USDC',
  tokenAmount: 6000,
  destinationEnsName: 'startuphuman.eth',
  destinationAddress: '0xDGFDSFS9F32D3WE',
  closeType: DealEndType.WITHDRAW
};
