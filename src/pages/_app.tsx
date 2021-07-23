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
import ConnectWalletProvider from "@/context/ConnectWalletProvider";

const INTERCOM_APP_ID = process.env.NEXT_PUBLIC_INTERCOM_APP_ID;

//Binding events.
Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

const SyndicateWeb3ReactProvider = dynamic(
  () => import("src/providers/web3Provider"),
  { ssr: false },
);

// Initialize Amplitude Services.
const AmplitudeProvider = dynamic(() => import("@/components/amplitude"), {
  ssr: false,
});

const App = ({ Component, pageProps }) => {
  return (
    <IntercomProvider appId={INTERCOM_APP_ID} autoBoot={true}>
      <SyndicateWeb3ReactProvider>
        <ConnectWalletProvider>
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
        </ConnectWalletProvider>
      </SyndicateWeb3ReactProvider>
    </IntercomProvider>
  );
};

export default wrapper.withRedux(App);
