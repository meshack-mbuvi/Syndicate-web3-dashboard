import FontsPreloader from "@/components/fonts";
import ConnectWalletProvider from "@/context/ConnectWalletProvider";
import CreateInvestmentClubProvider from "@/context/CreateInvestmentClubContext";
import OnboardingProvider from "@/context/OnboardingContext";
import { isDev, isSSR } from "@/utils/environment";
import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import withApollo from "next-with-apollo";
import dynamic from "next/dynamic";
import Head from "next/head";
import Router from "next/router";
import NProgress from "nprogress";
import "nprogress/nprogress.css"; //styles of nprogress
import React from "react";
/**
 * datepicker component requires these in-built styles, so we import them
 * from here to make them available globally
 */
import "react-datepicker/dist/react-datepicker.css";
import { wrapper } from "@/state";
import "../styles/animation.css";
import "../styles/custom-datepicker.css";
import "../styles/global.css";

//Binding events.
Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

// Initialize Amplitude Services.
const AmplitudeProvider = dynamic(() => import("@/components/amplitude"), {
  ssr: false,
});

const App = ({ Component, pageProps, apollo }) => {
  return (
    <ApolloProvider client={apollo}>
      <OnboardingProvider>
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
            <AmplitudeProvider />
            <Component {...pageProps} />
          </CreateInvestmentClubProvider>
        </ConnectWalletProvider>
      </OnboardingProvider>
    </ApolloProvider>
  );
};

export default withApollo(({ initialState }) => {
  const httpLink = new HttpLink({
    uri: isDev
      ? process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT
      : process.env.NEXT_PUBLIC_GRAPHQL_MAINNET_ENDPOINT,
  });

  return new ApolloClient({
    ssrMode: isSSR(),
    link: httpLink,
    cache: new InMemoryCache().restore(initialState || {}),
    connectToDevTools: isDev,
  });
})(wrapper.withRedux(App));
