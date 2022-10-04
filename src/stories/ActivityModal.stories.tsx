import ConnectWallet from '@/components/connectWallet';
import ActivityModal from '@/containers/layoutWithSyndicateDetails/activity/shared/ActivityModal';
import ConnectWalletProvider from '@/context/ConnectWalletProvider';
import { setCurrentTransaction } from '@/state/erc20transactions';
import { store } from '@/state/index';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { Provider, useDispatch } from 'react-redux';

const client = new ApolloClient({
  uri: '#',
  cache: new InMemoryCache()
});

export default {
  title: '4. Organisms/Activity Modal',

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
      // @ts-expect-error TS(2322): Type 'null' is not assignable to type '{ acquisiti... Remove this comment to see the full error message
      metadata: null,
      blockTimestamp: 123
    })
  );

  return (
    <div>
      <ActivityModal
        isOwner={false}
        showModal={true}
        // @ts-expect-error TS(2322): Type 'null' is not assignable to type '() => void'... Remove this comment to see the full error message
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
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
Default.args = {};
