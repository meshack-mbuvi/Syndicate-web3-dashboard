import ConnectWallet from '@/components/connectWallet';
import ConnectWalletProvider from '@/context/ConnectWalletProvider';
import LinkedWallets from '@/features/auth/components/settings/LinkedWallets';
import { store } from '@/state';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { Provider } from 'react-redux';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 5000 } }
});

export default {
  title: 'Organisms/Auth/Linked Wallets',
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

const Template = (args: any) => <LinkedWallets {...args} />;

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
Default.args = {
  linkedWallets: [
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
      collectives: { admin: ['✺OKAY'], member: [] }
    },
    {
      networks: ['Ethereum'],
      linkedAddress: '0x0936544BDD45DBC4E26771aFe038Bf9C17ae5162',
      clubs: { admin: [], member: ['✺FWB'] },
      collectives: { admin: [], member: [] }
    },
    {
      networks: ['Polygon'],
      linkedAddress: '0x6544BDD45DBC4E26771aFe038Bf9C17ae5162093',
      clubs: { admin: [], member: [] },
      collectives: { admin: ['✺ABSA'], member: ['✺FWB'] }
    }
  ]
};
