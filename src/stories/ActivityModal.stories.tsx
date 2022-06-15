import ActivityModal from '@/containers/layoutWithSyndicateDetails/activity/shared/ActivityModal';
import { Provider, useDispatch } from 'react-redux';
import { store } from '@/state/index';
import ConnectWalletProvider from '@/context/ConnectWalletProvider';
import ConnectWallet from '@/components/connectWallet';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { setCurrentTransaction } from '@/state/erc20transactions';

const client = new ApolloClient({
  uri: '#',
  cache: new InMemoryCache()
});

export default {
  title: '4. Organisms/Activity Modal',

  decorators: [
    (Story) => (
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

const Template = () => {
  {
    /* TODO: update this when PR 3821 is merged */
  }
  const dispatch = useDispatch();
  dispatch(
    setCurrentTransaction({
      category: 'DISTRIBUTION',
      note: 'Distributing first batch of funds from investments from the XYZ acquisition and Cryptopunk #1234 sale.',
      hash: '3e092jdd2',
      transactionInfo: {
        transactionHash: '3e092jdd2',
        from: 'asdfgsfd32',
        to: '0x2d368d6a84b791d634e6f9f81908d884849fd43d',
        isOutgoingTransaction: true
      },
      amount: '10',
      tokenSymbol: 'TOKN',
      tokenLogo: '/images/token.svg',
      tokenName: 'Token',
      readOnly: false,
      timestamp: 'Tuesday, Sep 14 2021, 3:45 PM',
      transactionId: 'transaction id',
      metadata: null,
      blockTimestamp: 123
    })
  );

  return (
    <div>
      <ActivityModal
        showModal={true}
        refetchTransactions={null}
        showNote={true}
        closeModal={null}
        setShowNote={() => {
          null;
        }}
      />
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {};
