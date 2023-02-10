import { ClubHeader } from '@/components/syndicates/shared/clubHeader';
import React from 'react';
import ConnectWalletProvider from '@/context/ConnectWalletProvider';
import ConnectWallet from '@/components/connectWallet';
import { Provider } from 'react-redux';
import { store } from '@/state/index';

export default {
  title: 'Molecules/Investment Clubs/Club Header',
  component: ClubHeader,
  decorators: [
    (Story: any) => (
      <Provider store={store}>
        <ConnectWalletProvider>
          <Story />
          <ConnectWallet />
        </ConnectWalletProvider>
      </Provider>
    )
  ]
};

const Template = (args: any) => <ClubHeader {...args} />;

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Default.args = {
  name: 'Alpha Beta Club',
  symbol: '✺ABC',
  owner: '0x0563A7aB3Da117e694c6B85f80A20aD5daabd6B9',
  clubAddress: '0x3056adb19b1049e4e6b098a9105830564f519604',
  loading: false,
  totalDeposits: '10000',
  loadingClubDeposits: false,
  managerSettingsOpen: false
};

export const Loading = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Loading.args = {
  name: '',
  symbol: '',
  owner: '',
  clubAddress: '',
  loading: true,
  totalDeposits: '',
  loadingClubDeposits: true,
  managerSettingsOpen: false
};
