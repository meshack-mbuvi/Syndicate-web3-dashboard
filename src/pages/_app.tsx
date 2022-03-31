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
  ApolloProvider,
  HttpLink,
  InMemoryCache
} from '@apollo/client';
import { RetryLink } from '@apollo/client/link/retry';
import withApollo from 'next-with-apollo';
import Head from 'next/head';
import Router from 'next/router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css'; //styles of nprogress
import React from 'react';
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

const App = ({ Component, pageProps, apollo }) => {
  useAmplitude();

  return (
    <ApolloProvider client={apollo}>
      <OnboardingProvider>
        <BeforeGettingStartedProvider>
          <ConnectWalletProvider>
            <CreateInvestmentClubProvider>
              <Head>
                <title>Home | Syndicate Dashboard</title>
                <link rel="shortcut icon" href="/images/logo.svg" />

                <FontsPreloader />

                <meta
                  name="viewport"
                  content="width=device-width, initial-scale=1, shrink-to-fit=no"
                />
              </Head>
              <Component {...pageProps} />
            </CreateInvestmentClubProvider>
          </ConnectWalletProvider>
        </BeforeGettingStartedProvider>
      </OnboardingProvider>
    </ApolloProvider>
  );
};

export default withApollo(({ initialState }) => {
  const backendHttpLink = new HttpLink({
    uri: isDev
      ? process.env.NEXT_PUBLIC_BACKEND_GRAPHQL_ENDPOINT_STAGING
      : process.env.NEXT_PUBLIC_BACKEND_GRAPHQL_ENDPOINT_PROD
  });
  const graphHttpLink = new HttpLink({
    uri: isDev
      ? process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT
      : process.env.NEXT_PUBLIC_GRAPHQL_MAINNET_ENDPOINT
  });

  const directionalLink = new RetryLink().split(
    (operation) => operation.getContext().clientName === 'backend',
    backendHttpLink,
    graphHttpLink
  );

  return new ApolloClient({
    ssrMode: isSSR(),
    link: directionalLink,
    cache: new InMemoryCache().restore(initialState || {}),
    connectToDevTools: isDev
  });
})(wrapper.withRedux(App));
