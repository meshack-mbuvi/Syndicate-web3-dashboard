import Header from '@/components/navigation/header/Header';
import React from 'react';
import { Provider } from "react-redux";
import { store } from "@/state/index";
import ConnectWalletProvider from '@/context/ConnectWalletProvider';
import ConnectWallet from '@/components/connectWallet';


export default {
  title: 'Molecules/Nav Bar',
  component: Header,
  decorators: [
    (Story) => (
      <Provider store={store}>
        <ConnectWalletProvider>
          <Story />
          <ConnectWallet />
        </ConnectWalletProvider>
      </Provider>
    ),
  ],
};

const Template = (args) => <Header {...args}/>;

export const Default = Template.bind({});
Default.args = {
    navItems: [
        { navItemText: "Portfolio", url: "#", isLegal: false }
    ]
};

