import Header from '@/components/navigation/header/Header';
import React from 'react';
import { Provider } from 'react-redux';
import { store } from '@/state/index';
import ConnectWalletProvider from '@/context/ConnectWalletProvider';
import ConnectWallet from '@/components/connectWallet';

export default {
  title: '3. Molecules/Nav Bar',
  component: Header,
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

const Template = (args: any) => <Header {...args} />;

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Default.args = {
  navItems: [{ navItemText: 'Portfolio', url: '#', isLegal: false }]
};
