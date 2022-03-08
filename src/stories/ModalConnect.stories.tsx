import ConnectWallet from '@/components/connectWallet';
import { PillButton } from '@/components/pillButtons';
import React from 'react';
import { Provider } from "react-redux";
import { store } from "@/state/index";
import ConnectWalletProvider from '@/context/ConnectWalletProvider';


export default {
  title: 'Molecules/Modal Connet',
  component: PillButton,
  argTypes: {
      isActive: {
        table: {
          type: { summary: 'boolean' },
        },
      }
  },
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

const Template = () => <ConnectWallet />;

export const Default = Template.bind({});
Default.args = {
};
