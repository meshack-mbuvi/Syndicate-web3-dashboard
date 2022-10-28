import ConnectWallet from '@/components/connectWallet';
import ActivityModal from '@/containers/layoutWithSyndicateDetails/activity/shared/ActivityModal';
import ConnectWalletProvider from '@/context/ConnectWalletProvider';
import { store } from '@/state/index';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { Provider } from 'react-redux';

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
