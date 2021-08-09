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
import dynamic from "next/dynamic";
import { wrapper } from "../redux/store";
import "../styles/animation.css";
import "../styles/global.css";
import "../styles/custom-datepicker.css";
import ConnectWalletProvider from "@/context/ConnectWalletProvider";
import CreateSyndicateProvider from "@/context/CreateSyndicateContext";
import SyndicateInBetaBannerProvider from "@/context/SyndicateInBetaBannerContext";

const INTERCOM_APP_ID = process.env.NEXT_PUBLIC_INTERCOM_APP_ID;

//Binding events.
Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

// Initialize Amplitude Services.
const AmplitudeProvider = dynamic(() => import("@/components/amplitude"), {
  ssr: false,
});

const App = ({ Component, pageProps }) => {
  return (
    <IntercomProvider appId={INTERCOM_APP_ID} autoBoot={true}>
      <SyndicateInBetaBannerProvider>
          <ConnectWalletProvider>
            <CreateSyndicateProvider>
              <Head>
                <title>Home | Syndicate Dashboard</title>
                <link rel="shortcut icon" href="/images/logo.svg" />
                <meta
                  name="viewport"
                  content="width=device-width, initial-scale=1, shrink-to-fit=no"
                />
              </Head>
              <AmplitudeProvider />
              <Component {...pageProps} />
            </CreateSyndicateProvider>
          </ConnectWalletProvider>
      </SyndicateInBetaBannerProvider>
    </IntercomProvider>
  );
};

export default wrapper.withRedux(App);
