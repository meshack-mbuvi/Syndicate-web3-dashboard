import ConnectWallet from '@/components/connectWallet';
import ConnectWalletProvider from '@/context/ConnectWalletProvider';
import AccountSettings from '@/features/auth/components/AccountSetting/AccountSettings';
import { AuthType } from '@/features/auth/components/AccountSetting/SocialCard';
import { store } from '@/state';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { Provider } from 'react-redux';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 5000 } }
});

export default {
  title: '4. Organisms/Auth/Account Settings',
  argTypes: {
    authType: {
      options: [AuthType.Discord, AuthType.Twitter],
      control: { type: 'select' }
    }
  },
  decorators: [
    (Story: any) => (
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <ConnectWalletProvider>
            <Story />
            <ConnectWallet />
          </ConnectWalletProvider>
        </Provider>
      </QueryClientProvider>
    )
  ]
};

const Template = (args: any) => <AccountSettings {...args} />;

const linkedWallets = [
  {
    networks: ['Ethereum', 'Polygon'],
    linkedAddress: '0x302d2274156925a2c4e4dd8D9568c415eEF66410',
    clubs: { admin: ['✺ABC', '✺XYZ', '✺XYE'], member: ['✺DUNE'] },
    collectives: { admin: ['✺SYNSYN'], member: ['✺ABSA'] }
  },
  {
    networks: ['Ethereum'],
    linkedAddress: '0x2274156925a2c4e46410dd8D956302d8c415eEF6',
    clubs: { admin: ['✺XYZ', '✺XYE'], member: ['✺FWB'] },
    collectives: { admin: ['✺SYNSYN'], member: [] }
  },
  {
    networks: ['Ethereum'],
    linkedAddress: '0x0936544BDD45DBC4E26771aFe038Bf9C17ae5162',
    clubs: { admin: [], member: ['✺FWB'] },
    collectives: { admin: [], member: [] }
  }
];

export const Discord = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
Discord.args = {
  username: 'Mutai#1234',
  authType: AuthType.Discord,
  linkedWallets
};

export const Twitter = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
Twitter.args = {
  username: '@alex',
  profileIcon: '/images/collectives/alex.jpg',
  authType: AuthType.Twitter,
  linkedWallets
};

export const Unlinked = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
Unlinked.args = {
  username: '',
  authType: AuthType.Discord,
  linkedWallets: []
};

export const UnlinkedSocial = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
UnlinkedSocial.args = {
  username: '',
  authType: AuthType.Discord,
  linkedWallets
};

export const UnlinkedWallets = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
UnlinkedWallets.args = {
  username: 'Bertie#1234',
  authType: AuthType.Discord,
  linkedWallets: []
};
