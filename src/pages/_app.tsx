import 'nprogress/nprogress.css'; //styles of nprogress
/**
 * datepicker component requires these in-built styles, so we import them
 * from here to make them available globally
 */
import 'react-datepicker/dist/react-datepicker.css';

import '../styles/animation.css';
import '../styles/custom-datepicker.css';
import '../styles/global.css';

import { useAmplitude } from '@/components/amplitude';
import FontsPreloader from '@/components/fonts';
import BeforeGettingStartedProvider from '@/context/beforeGettingStartedContext';
import ConnectWalletProvider from '@/context/ConnectWalletProvider';
import CreateInvestmentClubProvider from '@/context/CreateInvestmentClubContext';
import OnboardingProvider from '@/context/OnboardingContext';
import { wrapper } from '@/state';
import { isDev, isSSR } from '@/utils/environment';
import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  HttpLink,
  InMemoryCache
} from '@apollo/client';
import { RetryLink } from '@apollo/client/link/retry';
import withApollo from 'next-with-apollo';
import { AppProps } from 'next/app';
import Head from 'next/head';
import Router from 'next/router';
import NProgress from 'nprogress';
import React from 'react';
import { BACKEND_LINKS } from '@/Networks/backendLinks';

import { withLDProvider } from 'launchdarkly-react-client-sdk';
/**
 * datepicker component requires these in-built styles, so we import them
 * from here to make them available globally
 */
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/animation.css';
import '../styles/custom-datepicker.css';
import '../styles/global.css';

//Binding events.
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

const StateProviders: React.FC = ({ children }) => (
  <OnboardingProvider>
    <BeforeGettingStartedProvider>
      <CreateInvestmentClubProvider>
        <LDFeatureFlags>{children}</LDFeatureFlags>
      </CreateInvestmentClubProvider>
    </BeforeGettingStartedProvider>
  </OnboardingProvider>
);

const Body: React.FC<AppProps & { apollo: ApolloClient<unknown> }> = ({
  Component,
  pageProps,
  apollo
}) => {
  return (
    <>
      <Head>
        <title>Home | Syndicate Dashboard</title>
        {/* Safari favicon */}
        <link rel="icon" href="/favicon.png" sizes="any" />
        {/* Favicon */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml"></link>{' '}
        <FontsPreloader />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
      </Head>
      <ApolloProvider client={apollo}>
        <Component {...pageProps} />
      </ApolloProvider>
    </>
  );
};

const LDFeatureFlags: React.FC<any> = ({ children }) => {
  const Child = () => <>{children}</>;
  const WithLDContext = withLDProvider({
    clientSideID: isDev
      ? process.env.NEXT_PUBLIC_LAUNCHDARKLY_SDK_CLIENT_TEST!
      : process.env.NEXT_PUBLIC_LAUNCHDARKLY_SDK_CLIENT_PRODUCTION!
  })(Child);
  return <WithLDContext />;
};

const App = (props) => {
  useAmplitude();

  return (
    <StateProviders>
      <ConnectWalletProvider>
        <Body {...props} />
      </ConnectWalletProvider>
    </StateProviders>
  );
};

// Construct dynamic httpLinks from available networks and graphs
const constructGraphLinks = () => {
  const links = {};
  Object.entries(BACKEND_LINKS).map(([networkId, backendInfo]) => {
    const graphs = Object.keys(backendInfo.graphs);
    const httplinks = {};
    graphs.forEach((value) => {
      httplinks[value] = new HttpLink({
        uri: backendInfo.graphs[value]
      });
    });
    links[networkId] = httplinks;
  });

  return links;
};

const httpsLinks = Object.freeze(constructGraphLinks());

const apolloInitializer = ({ initialState }) => {
  const graphLink = new ApolloLink((operation) => {
    const { clientName = 'backend', chainId = 1 } = operation.getContext();
    return httpsLinks[chainId][clientName].request(operation);
  });
  return new ApolloClient({
    ssrMode: isSSR(),
    link: new RetryLink().concat(graphLink),
    cache: new InMemoryCache().restore(initialState || {}),
    connectToDevTools: isDev
  });
};

export default withApollo(apolloInitializer)(wrapper.withRedux(App));
