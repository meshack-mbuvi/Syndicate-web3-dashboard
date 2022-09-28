import NetworkComponent from '@/components/collectives/create/networkComponent';
import ConnectWallet from '@/components/connectWallet';
import ConnectWalletProvider from '@/context/ConnectWalletProvider';
import { useCreateState } from '@/hooks/collectives/useCreateCollective';
import { ContractMapper } from '@/hooks/useGasDetails';
import { store } from '@/state/index';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { Provider } from 'react-redux';

const client = new ApolloClient({
  uri: '#',
  cache: new InMemoryCache()
});

export default {
  title: '4. Organisms/Network component',
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
  const {
    name,
    symbol,
    pricePerNFT,
    maxPerWallet: maxPerMember,
    openUntil: openUntilWindow,
    EpochCloseTime,
    maxSupply: totalSupply,
    transferrable,
    creationStatus
  } = useCreateState();

  const handleConnectWallet = () => {
    // function to connect wallet
    console.log('...connecting wallet');
  };
  const handleLaunch = () => {
    console.log('...launching');
  };
  return (
    <NetworkComponent
      {...args}
      handleConnectWallet={handleConnectWallet}
      handleLaunch={handleLaunch}
      contract={ContractMapper.ERC721CollectiveFactory}
      args={{
        collectiveParams: {
          collectiveName: name,
          collectiveSymbol: symbol,
          totalSupply,
          maxPerMember,
          openUntil: openUntilWindow,
          ethPrice: pricePerNFT,
          tokenURI: creationStatus.ipfsHash,
          startTime: '0',
          endTime: String(EpochCloseTime),
          allowTransfer: transferrable
        }
      }}
    />
  );
};

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
Default.args = {
  account: '0x93C38105cd425F876Db356068A5aC066c5096A24',
  disabled: false
};

export const WalletNotConnectedAndEnabled = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
WalletNotConnectedAndEnabled.args = {
  account: '',
  disabled: false
};

export const WalletNotConnectedAndDisabled = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
WalletNotConnectedAndDisabled.args = {
  account: '',
  disabled: true
};

export const WalletConnectedAndEnabled = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
WalletConnectedAndEnabled.args = {
  account: '0x93C38105cd425F876Db356068A5aC066c5096A24',
  disabled: false
};

export const WalletConnectedAndDisabled = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
WalletConnectedAndDisabled.args = {
  account: '0x93C38105cd425F876Db356068A5aC066c5096A24',
  disabled: true
};
