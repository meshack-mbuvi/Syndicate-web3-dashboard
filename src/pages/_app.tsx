import "nprogress/nprogress.css"; //styles of nprogress
/**
 * datepicker component requires these in-built styles, so we import them
 * from here to make them available globally
 */
import "react-datepicker/dist/react-datepicker.css";
import "@/utils/firebase/initAuth";

import "../styles/animation.css";
import "../styles/global.css";
import "../styles/custom-datepicker.css";

import FontsPreloader from "@/components/fonts";
import ConnectWalletProvider from "@/context/ConnectWalletProvider";
import CreateSyndicateProvider from "@/context/CreateSyndicateContext";
import OnboardingProvider from "@/context/OnboardingContext";
import SyndicateInBetaBannerProvider from "@/context/SyndicateInBetaBannerContext";
import dynamic from "next/dynamic";
import Head from "next/head";
import Router from "next/router";
import NProgress from "nprogress";
import React from "react";
import { IntercomProvider } from "react-use-intercom";
import withApollo from "next-with-apollo";
import { isDev, isSSR } from "@/utils/environment";
import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { User, getAuth } from "firebase/auth";
import { wrapper } from "../redux/store";

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
              </CreateSyndicateProvider>
            </ConnectWalletProvider>
          </OnboardingProvider>
        </SyndicateInBetaBannerProvider>
      </ApolloProvider>
    </IntercomProvider>
  );
};

export default withApollo(({ initialState, ctx = {} }) => {
  const authLink = setContext(async (_, { headers }) => {
    const ssrMode = isSSR();
    const currentUser =
      ssrMode && "AuthUser" in ctx
        ? ((ctx as any).AuthUser as User)
        : getAuth().currentUser;
    const token = await currentUser?.getIdToken();

    return {
      headers: {
        ...headers,
        "X-Social-Token": token,
      },
    };
  });

  const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
  });

  return new ApolloClient({
    ssrMode: isSSR(),
    link: authLink.concat(httpLink),
    cache: new InMemoryCache().restore(initialState || {}),
    connectToDevTools: isDev,
  });
})(wrapper.withRedux(App));
