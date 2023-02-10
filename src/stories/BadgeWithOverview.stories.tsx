import { BadgeWithOverview } from '@/components/distributions/badgeWithOverview';
import { Provider } from 'react-redux';
import { store } from '@/state/index';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: '#',
  cache: new InMemoryCache()
});

export default {
  title: 'Organisms/Badge/With Overview',
  decorators: [
    (Story: any) => (
      <ApolloProvider client={client}>
        <Provider store={store}>
          <Story />
        </Provider>
      </ApolloProvider>
    )
  ]
};

const Template = (args: any) => {
  return <BadgeWithOverview {...args} />;
};

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Default.args = {
  tokensDetails: [
    {
      tokenSymbol: 'ETH',
      tokenAmount: 40.0,
      tokenIcon: '/images/ethereum-logo.svg',
      fiatAmount: 104136.51
    },
    {
      tokenSymbol: 'USDC',
      tokenAmount: 12342,
      tokenIcon: '/images/prodTokenLogos/USDCoin.svg',
      fiatAmount: 12321
    }
  ],
  gasEstimate: { tokenSymbol: 'ETH', tokenAmount: 0.05, fiatAmount: 121.77 }
};

export const Loading = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Loading.args = {
  tokensDetails: [
    {
      tokenSymbol: 'ETH',
      tokenAmount: 40.0,
      tokenIcon: '/images/ethereum-logo.svg',
      fiatAmount: 104136.51,
      isLoading: false
    },
    {
      tokenSymbol: 'USDC',
      tokenAmount: 12342,
      tokenIcon: '/images/prodTokenLogos/USDCoin.svg',
      fiatAmount: null,
      isLoading: true
    }
  ],
  gasEstimate: {
    tokenSymbol: 'ETH',
    tokenAmount: null,
    fiatAmount: null,
    isLoading: true
  }
};

export const Waiting = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Waiting.args = {
  gasEstimate: {
    tokenSymbol: 'ETH',
    tokenAmount: null,
    fiatAmount: null,
    isLoading: true
  }
};
