import { Web3Provider } from "@ethersproject/providers";
import { Web3ReactProvider } from "@web3-react/core";
import Head from "next/head";
import PropTypes from "prop-types";
import React, { useEffect } from "react";
import Router from "next/router";
import NProgress from "nprogress";
import { useDispatch } from "react-redux";
/**
 * datepicker component requires these in-built styles, so we import them
 * from here to make them available globally
 */
import "react-datepicker/dist/react-datepicker.css";
import { wrapper } from "../redux/store";
import { getLibrary as getCache } from "src/redux/actions/web3Provider";
import "nprogress/nprogress.css"; //styles of nprogress
import "../styles/animation.css";
import "../styles/global.css";

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
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCache());
  }, [dispatch]);
  return (
    <>
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
    </>
  );
};

App.propTypes = {
  Component: PropTypes.any.isRequired,
  pageProps: PropTypes.any,
};

export default wrapper.withRedux(App);
