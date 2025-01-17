import { RouterContext } from 'next/dist/shared/lib/router-context';
import '../src/styles/animation.css';
import '../src/styles/global.css';
import * as NextImage from 'next/image';
import { Provider } from 'react-redux';
import { store } from '@/state/index';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import ConnectWalletProvider from '@/context/ConnectWalletProvider';
import ConnectWallet from '@/components/connectWallet';

const OriginalNextImage = NextImage.default;

Object.defineProperty(NextImage, 'default', {
  configurable: true,
  value: (props) => <OriginalNextImage {...props} unoptimized />
});

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/
    }
  },
  nextRouter: {
    Provider: RouterContext.Provider
  },
  options: {
    storySort: {
      order: [
        'Styles',
        'Atoms',
        'Molecules',
        'Organisms',
        'Templates',
        'Pages',
        'Animations',
        'Experiments'
      ]
    }
  },
  backgrounds: {
    default: 'black',
    values: [
      {
        name: 'black',
        value: 'black'
      },
      {
        name: 'white',
        value: 'white'
      }
    ]
  }
};

const client = new ApolloClient({
  uri: '#',
  cache: new InMemoryCache()
});

export const decorators = [
  (Story) => (
    <div className="text-white">
      <ApolloProvider client={client}>
        <Provider store={store}>
          <ConnectWalletProvider>
            <Story />
            <ConnectWallet />
          </ConnectWalletProvider>
        </Provider>
      </ApolloProvider>
    </div>
  )
];
