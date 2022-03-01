import "nprogress/nprogress.css"; //styles of nprogress
/**
 * datepicker component requires these in-built styles, so we import them
 * from here to make them available globally
 */
import "react-datepicker/dist/react-datepicker.css";

import "../styles/animation.css";
import "../styles/custom-datepicker.css";
import "../styles/global.css";

import { useAmplitude } from "@/components/amplitude";
import FontsPreloader from "@/components/fonts";
import BeforeGettingStartedProvider from "@/context/beforeGettingStartedContext";
import ConnectWalletProvider from "@/context/ConnectWalletProvider";
import CreateInvestmentClubProvider from "@/context/CreateInvestmentClubContext";
import OnboardingProvider from "@/context/OnboardingContext";
import { wrapper } from "@/state";
import { isDev, isSSR } from "@/utils/environment";
import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { RetryLink } from "@apollo/client/link/retry";
import withApollo from "next-with-apollo";
import { AppProps } from "next/app";
import Head from "next/head";
import Router from "next/router";
import NProgress from "nprogress";
import React from "react";

//Binding events.
Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

const StateProviders: React.FC = ({ children }) => (
  <OnboardingProvider>
    <BeforeGettingStartedProvider>
      <CreateInvestmentClubProvider>{children}</CreateInvestmentClubProvider>
    </BeforeGettingStartedProvider>
  </OnboardingProvider>
);

const Body: React.FC<AppProps & { apollo: ApolloClient<unknown> }> = ({
  Component,
  pageProps,
  apollo,
}) => {
  return (
    <>
      <Head>
        <title>Home | Syndicate Dashboard</title>
        <link rel="shortcut icon" href="/images/logo.svg" />

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

const httpsLinks = Object.freeze({
  backend: new HttpLink({
    uri: isDev
      ? `${process.env.NEXT_PUBLIC_BACKEND_GRAPHQL_ENDPOINT_STAGING}`
      : `${process.env.NEXT_PUBLIC_BACKEND_GRAPHQL_ENDPOINT_PROD}`,
  }),
  1: new HttpLink({
    uri: `${process.env.NEXT_PUBLIC_GRAPHQL_MAINNET_ENDPOINT}`,
  }),
  4: new HttpLink({
    uri: `${process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT}`,
  }),
  137: new HttpLink({
    uri: `${process.env.NEXT_PUBLIC_GRAPHQL_MATIC_ENDPOINT}`,
  }),
} as const);

const apolloInitializer = ({ initialState }) => {
  const graphLink = new ApolloLink((operation) => {
    const { chainId = "backend" } = operation.getContext();
    return httpsLinks[chainId].request(operation);
  });

  return new ApolloClient({
    ssrMode: isSSR(),
    link: new RetryLink().concat(graphLink),
    cache: new InMemoryCache().restore(initialState || {}),
    connectToDevTools: isDev,
  });
};

export default withApollo(apolloInitializer)(wrapper.withRedux(App));
