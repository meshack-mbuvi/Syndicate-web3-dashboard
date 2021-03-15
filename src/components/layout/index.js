import React from "react";
import PropTypes from "prop-types";
import { Web3Provider } from "@ethersproject/providers";
import { Web3ReactProvider } from "@web3-react/core";
// import store from "src/redux/store";

// Layout wrappers
import ContentWrapper from "./content-wrapper";

import SEO from "../seo";

// Other components
import Header from "src/components/navigation/header";
import HorizontalDivider from "src/components/horizontalDivider";

const getLibrary = (provider) => {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
};

export const Layout = ({ children }) => {
  return (
    <>
      <Web3ReactProvider getLibrary={getLibrary}>
        <div>
          <SEO
            keywords={[`gatsby`, `tailwind`, `react`, `tailwindcss`]}
            title="Home"
          />
          <Header />
          <HorizontalDivider />
          <ContentWrapper>{children}</ContentWrapper>
        </div>
      </Web3ReactProvider>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
