import DealPrecommitModal from '@/features/deals/components/precommit/allocateModal';

export default {
  title: 'Organisms/Deals/Precommit/Allocate'
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
  showWaitingOnWalletLoadingState: false,
  depositTokenSymbol: 'USDC',
  depositTokenLogo: '/images/prodTokenLogos/USDCoin.svg',
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

export const AllowanceWaiting = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
AllowanceWaiting.args = {
  dealName: 'Privax Seed',
  tokenAmount: 3000,
  tokenLogo: '/images/prodTokenLogos/USDCoin.svg',
  tokenSymbol: 'USDC',
  activeStepIndex: 0,
  showWaitingOnWalletLoadingState: true,
  depositTokenSymbol: 'USDC',
  depositTokenLogo: '/images/prodTokenLogos/USDCoin.svg',
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

export const Request = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
Request.args = {
  dealName: 'Privax Seed',
  tokenAmount: 3000,
  tokenLogo: '/images/prodTokenLogos/USDCoin.svg',
  tokenSymbol: 'USDC',
  activeStepIndex: 1,
  showWaitingOnWalletLoadingState: false,
  depositTokenSymbol: 'USDC',
  depositTokenLogo: '/images/prodTokenLogos/USDCoin.svg',
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

export const RequestWaiting = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
RequestWaiting.args = {
  dealName: 'Privax Seed',
  tokenAmount: 3000,
  tokenLogo: '/images/prodTokenLogos/USDCoin.svg',
  tokenSymbol: 'USDC',
  activeStepIndex: 1,
  showWaitingOnWalletLoadingState: true,
  depositTokenSymbol: 'USDC',
  depositTokenLogo: '/images/prodTokenLogos/USDCoin.svg',
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
