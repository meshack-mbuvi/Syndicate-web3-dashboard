import AuthAccountSwitcherDropdown from '@/features/auth/components/accountSwitcherDropdown';

export default {
  title: 'Molecules/Auth/Account Switcher Dropdown'
};

const Template = (args: any) => {
  return (
    <div className="flex-col items-end space-y-2 inline-flex">
      <div className="rounded-full h-10 w-24 bg-gray-syn8" />
      <AuthAccountSwitcherDropdown
        walletProviderName={args.walletProviderName}
        wallets={args.wallets}
        walletIsLoadingIndex={args.walletIsLoadingIndex}
        externalLink={args.externalLink}
        activeWalletIndex={args.activeWalletIndex}
        isActiveWalletAContract={args.isActiveWalletAContract}
        handleDisconnect={() => {
          alert('Disconnected wallet');
        }}
        handleWalletChange={(index) => {
          alert(`Changed active wallet index to ${index}`);
        }}
        handleLinkWalletClick={() => {
          alert('Clicked link wallet');
        }}
        handleAccountSettingsClick={() => {
          alert('Clicked account settings');
        }}
        handleSignOutClick={() => {
          alert('Clicked sign out');
        }}
      />
    </div>
  );
};

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
Default.args = {
  walletProviderName: 'MetaMask',
  activeWalletIndex: 0,
  wallets: [
    {
      address: '0x8410B86f3220631D5110a31f966f12C7A4309435',
      name: 'first.eth',
      avatar: '/images/jazzicon.png'
    },
    {
      address: '0x8410B86f3220631D5110a31f966f12C7A4309435',
      name: 'second.eth'
    },
    {
      address: '0x8410B86f3220631D5110a31f966f12C7A4309435',
      name: 'third.eth',
      avatar: '/images/jazzicon.png'
    }
  ],
  externalLink: 'https://storybook.syndicate.io/'
};

export const Loading = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
Loading.args = {
  walletProviderName: 'MetaMask',
  activeWalletIndex: 0,
  wallets: [
    {
      address: '0x8410B86f3220631D5110a31f966f12C7A4309435',
      name: 'first.eth',
      avatar: '/images/jazzicon.png'
    },
    {
      address: '0x8410B86f3220631D5110a31f966f12C7A4309435',
      name: 'second.eth'
    },
    {
      address: '0x8410B86f3220631D5110a31f966f12C7A4309435',
      name: 'third.eth',
      avatar: '/images/jazzicon.png'
    }
  ],
  walletIsLoadingIndex: 1,
  externalLink: 'https://storybook.syndicate.io/'
};

export const SingleWallet = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
SingleWallet.args = {
  walletProviderName: 'MetaMask',
  activeWalletIndex: 0,
  wallets: [
    {
      address: '0x8410B86f3220631D5110a31f966f12C7A4309435',
      name: 'first.eth',
      avatar: '/images/jazzicon.png'
    }
  ],
  externalLink: 'https://storybook.syndicate.io/'
};

export const Disconnected = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
Disconnected.args = {
  walletProviderName: 'MetaMask',
  externalLink: 'https://storybook.syndicate.io/'
};

export const ManyWallets = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
ManyWallets.args = {
  walletProviderName: 'MetaMask',
  activeWalletIndex: 0,
  wallets: [
    {
      address: '0x8410B86f3220631D5110a31f966f12C7A4309435',
      name: 'first.eth',
      avatar: '/images/jazzicon.png'
    },
    {
      address: '0x8410B86f3220631D5110a31f966f12C7A4309435',
      name: 'second.eth'
    },
    {
      address: '0x8410B86f3220631D5110a31f966f12C7A4309435',
      name: 'third.eth',
      avatar: '/images/jazzicon.png'
    },
    {
      address: '0x8410B86f3220631D5110a31f966f12C7A4309435',
      name: 'fourth.eth',
      avatar: '/images/jazzicon.png'
    },
    {
      address: '0x8410B86f3220631D5110a31f966f12C7A4309435',
      name: 'fifth.eth',
      avatar: '/images/jazzicon.png'
    }
  ],
  externalLink: 'https://storybook.syndicate.io/'
};

export const ContractWallet = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
ContractWallet.args = {
  walletProviderName: 'MetaMask',
  activeWalletIndex: 0,
  isActiveWalletAContract: true,
  wallets: [
    {
      address: '0x8410B86f3220631D5110a31f966f12C7A4309435',
      name: 'first.eth',
      avatar: '/images/jazzicon.png'
    },
    {
      address: '0x8410B86f3220631D5110a31f966f12C7A4309435',
      name: 'second.eth'
    },
    {
      address: '0x8410B86f3220631D5110a31f966f12C7A4309435',
      name: 'third.eth',
      avatar: '/images/jazzicon.png'
    },
    {
      address: '0x8410B86f3220631D5110a31f966f12C7A4309435',
      name: 'fourth.eth',
      avatar: '/images/jazzicon.png'
    },
    {
      address: '0x8410B86f3220631D5110a31f966f12C7A4309435',
      name: 'fifth.eth',
      avatar: '/images/jazzicon.png'
    },
    {
      address: '0x8410B86f3220631D5110a31f966f12C7A4309435',
      name: 'sixth.eth',
      avatar: '/images/jazzicon.png'
    }
  ],
  externalLink: 'https://storybook.syndicate.io/'
};
