import ConnectWallet from '@/components/connectWallet';
import TransactionDetails from '@/containers/layoutWithSyndicateDetails/activity/shared/TransactionDetails';
import ConnectWalletProvider from '@/context/ConnectWalletProvider';
import { store } from '@/state/index';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { Provider } from 'react-redux';

const client = new ApolloClient({
  uri: '#',
  cache: new InMemoryCache()
});

export default {
  title: '3. Molecules/Transaction Details',
  decorators: [
    (Story: any) => (
      <ApolloProvider client={client}>
        <Provider store={store}>
          <ConnectWalletProvider>
            <Story />
            <ConnectWallet />
          </ConnectWalletProvider>
        </Provider>
      </ApolloProvider>
    )
  ]
};

const Template = (args: any) => {
  return <TransactionDetails {...args} />;
};

export const Investment = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Investment.args = {
  tokenDetails: [
    { name: 'Token', symbol: 'TOKN', icon: '/images/token.svg', amount: '123' }
  ],
  transactionType: 'outgoing',
  isTransactionAnnotated: true,
  addresses: ['0x2d368d6a84b791d634e6f9f81908d884849fd43d'],
  category: 'INVESTMENT',
  onModal: true,
  contractAddress: ''
};

export const Distribution = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Distribution.args = {
  tokenDetails: [
    {
      name: 'Token A',
      symbol: 'TOKNA',
      icon: '/images/token.svg',
      amount: '123'
    },
    {
      name: 'Token B',
      symbol: 'TOKNB',
      icon: '/images/token.svg',
      amount: '123'
    },
    {
      name: 'Token C',
      symbol: 'TOKNC',
      icon: '/images/token.svg',
      amount: '123'
    },
    {
      name: 'Token D',
      symbol: 'TOKND',
      icon: '/images/token.svg',
      amount: '123'
    },
    {
      name: 'Token E',
      symbol: 'TOKNE',
      icon: '/images/token.svg',
      amount: '123'
    }
  ],
  transactionType: 'outgoing',
  isTransactionAnnotated: true,
  addresses: [
    '0x2d368d6a84b791d634e6f9f81908d884849fd43d',
    '0x2d368d6a84b791d634e6f9f81908d884849fd43d'
  ],
  category: 'DISTRIBUTION',
  onModal: true
};

export const DistributionSingles = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
DistributionSingles.args = {
  tokenDetails: [
    { name: 'Token', symbol: 'TOKN', icon: '/images/token.svg', amount: '123' }
  ],
  transactionType: 'outgoing',
  isTransactionAnnotated: true,
  addresses: ['0x2d368d6a84b791d634e6f9f81908d884849fd43d'],
  category: 'DISTRIBUTION',
  onModal: true
};
