import { Web3Provider } from "@ethersproject/providers";
import { Web3ReactProvider } from "@web3-react/core";
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
import "../styles/global.css";

const INTERCOM_APP_ID = process.env.NEXT_PUBLIC_INTERCOM_APP_ID;

/**
 * This function configures web3 integration
 * @param {*} provider is passed by web3ReactProvider
 */
const getLibrary = (provider) => {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
};

//Binding events.
Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

const App = ({ Component, pageProps }) => {
  return (
    <IntercomProvider appId={INTERCOM_APP_ID} autoBoot={true}>
      <Head>
        <title>Home | Syndicate Dashboard</title>
        <link rel="shortcut icon" href="/images/logo.svg" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
      </Head>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Component {...pageProps} />
      </Web3ReactProvider>
    </IntercomProvider>
  );
};

export default wrapper.withRedux(App);
