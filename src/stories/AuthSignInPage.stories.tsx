import { ProgressState } from '@/components/progressCard';
import ConnectWalletProvider from '@/context/ConnectWalletProvider';
import { Provider } from 'react-redux';
import { store } from '@/state/index';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { AuthSignInPage } from '@/features/auth/components/signInPage';

const client = new ApolloClient({
  uri: '#',
  cache: new InMemoryCache()
});

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 5000 } }
});

export default {
  title: 'Pages/Auth/Sign In',
  argTypes: {
    state: {
      options: [
        ProgressState.FAILURE,
        ProgressState.PENDING,
        ProgressState.SUCCESS,
        ProgressState.CONFIRM
      ],
      control: { type: 'select' }
    }
  },
  decorators: [
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
    (Story: any) => (
      <ApolloProvider client={client}>
        <Provider store={store}>
          <ConnectWalletProvider>
            <QueryClientProvider client={queryClient}>
              <Story />
            </QueryClientProvider>
          </ConnectWalletProvider>
        </Provider>
      </ApolloProvider>
    )
  ]
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const Template = (args: any) => {
  return <AuthSignInPage {...args} />;
};

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
Default.args = {
  handleDiscordClick: () => {
    alert('Clicked Discord Sign In');
  }
};
