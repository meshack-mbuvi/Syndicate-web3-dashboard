import { OpenUntil } from '@/components/collectives/create/inputs/openUntil/radio';
import { TimeWindow } from '@/components/collectives/create/inputs/timeWindow';
import { CollectiveFormReview } from '@/components/collectives/create/review';
import ConnectWallet from '@/components/connectWallet';
import ConnectWalletProvider from '@/context/ConnectWalletProvider';
import { store } from '@/state/index';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { Provider } from 'react-redux';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

// react-query
const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 5000 } }
});

const client = new ApolloClient({
  uri: '#',
  cache: new InMemoryCache()
});

export default {
  title: '4. Organisms/Collectives/Create/Review',
  isFullscreen: true,
  decorators: [
    (Story: any) => (
      <ApolloProvider client={client}>
        <QueryClientProvider client={queryClient}>
          <Provider store={store}>
            <ConnectWalletProvider>
              <Story />
              <ConnectWallet />
            </ConnectWalletProvider>
          </Provider>
        </QueryClientProvider>
      </ApolloProvider>
    )
  ]
};

const Template = (args: any) => {
  const [nameValue, setNameValue] = useState('Alpha Beta Punks');
  const [tokenValue, setTokenValue] = useState('ABP');
  const [priceToJoin, setPriceToJoin] = useState(4);
  const [maxPerWallet, setMaxPerWallet] = useState(123);
  const [openUntil, setOpenUntil] = useState(OpenUntil.FUTURE_DATE);
  const [closeDate, setCloseDate] = useState(new Date());
  const [closeTime, setCloseTime] = useState('00:00');
  const [timeWindow, setTimeWindow] = useState(TimeWindow.CUSTOM);
  const [allowOwnershipTransfer, setAllowOwnershipTransfer] = useState(true);
  const [maxSupply, setMaxSupply] = useState(123);
  const [hasAgreedToTerms, setHasAgreedToTerms] = useState(false);

  const handleAgreedToTerms = () => {
    setHasAgreedToTerms(!hasAgreedToTerms);
  };

  return (
    <CollectiveFormReview
      nameValue={nameValue}
      handleNameChange={setNameValue}
      tokenSymbolValue={tokenValue}
      handleTokenSymbolChange={setTokenValue}
      priceToJoin={priceToJoin}
      handlePriceToJoinChange={setPriceToJoin}
      handleClickToChangeToken={null}
      maxPerWallet={maxPerWallet}
      handleMaxPerWalletChange={setMaxPerWallet}
      openUntil={openUntil}
      setOpenUntil={setOpenUntil}
      closeDate={closeDate}
      handleCloseDateChange={setCloseDate}
      closeTime={closeTime}
      handleCloseTimeChange={setCloseTime}
      selectedTimeWindow={timeWindow}
      handleTimeWindowChange={setTimeWindow}
      endOfTimeWindow={'Jun 11, 2021 11:59pm PST'}
      maxSupply={maxSupply}
      handleMaxSupplyChange={setMaxSupply}
      allowOwnershipTransfer={allowOwnershipTransfer}
      handleChangeAllowOwnershipTransfer={setAllowOwnershipTransfer}
      handleAgreedToTerms={handleAgreedToTerms}
      hasAgreedToTerms={hasAgreedToTerms}
      {...args}
    />
  );
};

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Default.args = {
  tokenDetails: { symbol: 'ETH', icon: '/images/chains/ethereum.svg' },
  isSubmitButtonActive: true,
  handleSubmit: () => ({}),
  account: '0x93C38105cd425F876Db356068A5aC066c5096A24'
};

export const WalletNotConnected = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
WalletNotConnected.args = {
  tokenDetails: { symbol: 'ETH', icon: '/images/chains/ethereum.svg' },
  isSubmitButtonActive: true,
  handleSubmit: () => ({}),
  account: ''
};
