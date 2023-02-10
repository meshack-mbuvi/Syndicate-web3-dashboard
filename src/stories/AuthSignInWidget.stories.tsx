import {
  AuthSignInWidget,
  AuthSignInWidgetState
} from '@/features/auth/components/signInWidget';
import { Provider } from 'react-redux';
import { store } from '@/state/index';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: '#',
  cache: new InMemoryCache()
});

export default {
  title: 'Pages/Auth/Sign In Widget',
  argTypes: {
    state: {
      options: [
        AuthSignInWidgetState.CONNECT_WALLET,
        AuthSignInWidgetState.SIGN_IN
      ],
      control: { type: 'select' }
    }
  },
  decorators: [
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
    (Story: any) => (
      <ApolloProvider client={client}>
        <Provider store={store}>
          <Story />
        </Provider>
      </ApolloProvider>
    )
  ]
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const Template = (args: any) => {
  return <AuthSignInWidget {...args} />;
};

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
Default.args = {
  handleCTAClick: () => {
    alert('Clicked CTA button');
  }
};
