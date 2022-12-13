import DealPrecommitModal from '@/features/deals/components/precommit/allocateModal';

export default {
  title: '4. Organisms/Deals/Precommit/Allocate'
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const Template = (args: any) => {
  return <DealPrecommitModal {...args} />;
};

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
Default.args = {
  dealName: 'Privax Seed',
  tokenAmount: 3000,
  tokenLogo: '/images/prodTokenLogos/USDCoin.svg',
  tokenSymbol: 'USDC',
  activeStepIndex: 0,
  showWaitingOnWalletLoadingState: false
};

export const AllowanceWaiting = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
AllowanceWaiting.args = {
  dealName: 'Privax Seed',
  tokenAmount: 3000,
  tokenLogo: '/images/prodTokenLogos/USDCoin.svg',
  tokenSymbol: 'USDC',
  activeStepIndex: 0,
  showWaitingOnWalletLoadingState: true
};

export const Request = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
Request.args = {
  dealName: 'Privax Seed',
  tokenAmount: 3000,
  tokenLogo: '/images/prodTokenLogos/USDCoin.svg',
  tokenSymbol: 'USDC',
  activeStepIndex: 1,
  showWaitingOnWalletLoadingState: false
};

export const RequestWaiting = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
RequestWaiting.args = {
  dealName: 'Privax Seed',
  tokenAmount: 3000,
  tokenLogo: '/images/prodTokenLogos/USDCoin.svg',
  tokenSymbol: 'USDC',
  activeStepIndex: 1,
  showWaitingOnWalletLoadingState: true
};
