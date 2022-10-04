import ConnectWallet from '@/components/connectWallet';
import { PillButton } from '@/components/pillButtons';
import React from 'react';
import { Provider } from 'react-redux';
import { store } from '@/state/index';
import ConnectWalletProvider from '@/context/ConnectWalletProvider';

export default {
  title: '3. Molecules/Modal Connet',
  component: PillButton,
  argTypes: {
    isActive: {
      table: {
        type: { summary: 'boolean' }
      }
    }
  },
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

const Template = () => <ConnectWallet />;

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
Default.args = {};
