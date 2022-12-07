import { RouterContext } from 'next/dist/shared/lib/router-context';
import '../src/styles/animation.css';
import '../src/styles/global.css';
import * as NextImage from 'next/image';
import { Provider } from 'react-redux';
import { store } from '@/state/index';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

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
          <Story />
        </Provider>
      </ApolloProvider>
    </div>
  )
];
