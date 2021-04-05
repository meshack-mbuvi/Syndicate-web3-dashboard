import React from "react";
import Head from "next/head";
import { Provider } from "react-redux";
import store from "../redux/store";
import { Web3Provider } from "@ethersproject/providers";
import { Web3ReactProvider } from "@web3-react/core";

import "../styles/global.css";
import "../styles/animation.css";

/**
 * datepicker component requires these in-built styles, so we import them
 * from here to make them available globally
 */
import "react-datepicker/dist/react-datepicker.css";
/**
 * This function configures web3 integration
 * @param {*} provider is passed by web3ReactProvider
 */
const getLibrary = (provider) => {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
};

function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Home | Syndicate Dashboard</title>
        <link rel="shortcut icon" href="/favicon.png" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
      </Head>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Provider store={store()}>
          <div>
            <Component {...pageProps} />
          </div>
        </Provider>
      </Web3ReactProvider>
    </>
  );
}

export default App;
