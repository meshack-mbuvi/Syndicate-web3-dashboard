/**
 * [...].js file defines where the router object if found for other components.
 * See the link below for reference
 * https://github.com/gatsbyjs/gatsby/blob/master/examples/client-only-paths/src/pages/%5B...%5D.js
 */
import React from "react";
import { Router } from "@reach/router";
import { Web3Provider } from "@ethersproject/providers";
import { Web3ReactProvider } from "@web3-react/core";

import Feed from "src/containers/feed";
import Syndicates from "src/containers/syndicates";
import Messages from "src/containers/messages";
import SyndicateDeposits from "src/containers/syndicateDeposits";
import Discover from "src/containers/discover";

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

/**
 * This component handles routing in the applocation
 * Whenever a new page is to be added to the application, the route/path for the
 * new page should be registered here. Most importantly, this will handle pages
 * with dynamic url parameters.
 */
const App = () => (
  <Web3ReactProvider getLibrary={getLibrary}>
    <Router>
      <Feed path="/feed" />
      <Syndicates path="/syndicates" />
      <SyndicateDeposits path="/syndicates/:address" />
      <Messages path="/messages" />
      <Discover path="/discover" />
    </Router>
  </Web3ReactProvider>
);

export default App;
