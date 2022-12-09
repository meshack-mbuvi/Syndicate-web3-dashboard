import { CollectiveCard } from '@/components/collectives/card';
import { CollectiveCardType } from '@/state/modifyCollectiveSettings/types';
import { Provider } from 'react-redux';
import { store } from '@/state/index';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
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
  title: '3. Molecules/Collectives/Card',
  decorators: [
    (Story: any) => (
      <ApolloProvider client={client}>
        <QueryClientProvider client={queryClient}>
          <Provider store={store}>
            <Story />
          </Provider>
        </QueryClientProvider>
      </ApolloProvider>
    )
  ]
};

const Template = (args: any) => {
  return <CollectiveCard {...args} />;
};

export const TimeWindow = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
TimeWindow.args = {
  cardType: CollectiveCardType.TIME_WINDOW,
  closeDate: 'Jun 11, 2021',
  passes: { available: 1200, total: 4000 },
  price: {
    tokenAmount: 0.5,
    tokenSymbol: 'ETH',
    tokenIcon: '/images/chains/ethereum.svg'
  }
};

export const MaxSupply = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
MaxSupply.args = {
  cardType: CollectiveCardType.MAX_TOTAL_SUPPLY,
  closeDate: 'Jun 11, 2021',
  passes: { available: 1200, total: 4000 },
  price: {
    tokenAmount: 0.5,
    tokenSymbol: 'ETH',
    tokenIcon: '/images/chains/ethereum.svg'
  }
};

export const Free = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Free.args = {
  cardType: CollectiveCardType.OPEN_UNTIL_CLOSED,
  closeDate: 'Jun 11, 2021',
  passes: { available: 1200, total: 4000 },
  price: {
    tokenAmount: 0.5,
    tokenSymbol: 'ETH',
    tokenIcon: '/images/chains/ethereum.svg'
  }
};
