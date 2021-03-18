import React from "react";
import PropTypes from "prop-types";

// Layout wrapper is the container component for all other other nodes in the app
import ContentWrapper from "./content-wrapper";

import SEO from "../seo";

import Header from "src/components/navigation/header";

export const Layout = ({ children }) => {
  return (
    <div>
      <SEO
        keywords={[`gatsby`, `tailwind`, `react`, `tailwindcss`]}
        title="Home"
      />
      <Header />
      <ContentWrapper>{children}</ContentWrapper>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
