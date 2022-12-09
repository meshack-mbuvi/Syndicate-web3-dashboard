import ConnectWallet from '@/components/connectWallet';
import ConnectWalletProvider from '@/context/ConnectWalletProvider';
import { store } from '@/state';
import React from 'react';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import WalletCard from '@/features/auth/components/settings/WalletCard';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 5000 } }
});

const client = new ApolloClient({
  uri: '#',
  cache: new InMemoryCache()
});

export default {
  title: '3. Molecules/Auth/Wallet Card',
  decorators: [
    (Story: any) => (
      <Provider store={store}>
        <ApolloProvider client={client}>
          <QueryClientProvider client={queryClient}>
            <ConnectWalletProvider>
              <Story />
              <ConnectWallet />
            </ConnectWalletProvider>
          </QueryClientProvider>
        </ApolloProvider>
      </Provider>
    )
  ]
};

const Template = (args: any) => <WalletCard {...args} />;

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
Default.args = {
  networks: ['Ethereum', 'Polygon'],
  linkedAddress: '0x684ad7247E25588fc1742F7dc3Ff783808C88A35',
  clubs: { admin: ['✺ABC', '✺XYZ', '✺XYE'], member: ['✺DUNE'] },
  collectives: { admin: [], member: [] }
};

export const WalletWithNoClubs = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
WalletWithNoClubs.args = {
  networks: ['Ethereum'],
  linkedAddress: '0x48c32bb3ec0f9f3e54295f84aa61fe876abf7436',
  clubs: { admin: [], member: [] },
  collectives: { admin: [], member: [] }
};

export const WalletWithClubs = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
WalletWithClubs.args = {
  networks: ['Polygon'],
  linkedAddress: '0x48c32bb3ec0f9f3e54295f84aa61fe876abf7436',
  clubs: { admin: ['✺FWB'], member: ['✺DUNE'] },
  collectives: { admin: [], member: [] }
};
