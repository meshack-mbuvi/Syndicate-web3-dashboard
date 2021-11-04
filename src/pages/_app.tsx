import FontsPreloader from "@/components/fonts";
import ConnectWalletProvider from "@/context/ConnectWalletProvider";
import CreateInvestmentClubProvider from "@/context/CreateInvestmentClubContext";
import CreateSyndicateProvider from "@/context/CreateSyndicateContext";
import OnboardingProvider from "@/context/OnboardingContext";
import SyndicateInBetaBannerProvider from "@/context/SyndicateInBetaBannerContext";
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
import { IntercomProvider } from "react-use-intercom";
import { wrapper } from "../redux/store";
import "../styles/animation.css";
import "../styles/custom-datepicker.css";
import "../styles/global.css";

const INTERCOM_APP_ID = process.env.NEXT_PUBLIC_INTERCOM_APP_ID;

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
    <IntercomProvider appId={INTERCOM_APP_ID} autoBoot={true}>
      <ApolloProvider client={apollo}>
        <SyndicateInBetaBannerProvider>
          <OnboardingProvider>
            <ConnectWalletProvider>
              <CreateSyndicateProvider>
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
              </CreateSyndicateProvider>
            </ConnectWalletProvider>
          </OnboardingProvider>
        </SyndicateInBetaBannerProvider>
      </ApolloProvider>
      {/* Placing tooltips rendered within modals in this high level component 
      "I suggest always putting <ReactTooltip /> in the Highest level or smart component of Redux, so you might need these static method to control tooltip's behaviour in some situations"
      Source: Troubleshooting section of https://www.npmjs.com/package/react-tooltip */}
    </IntercomProvider>
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
