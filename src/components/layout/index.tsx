import React from "react";
import PropTypes from "prop-types";

import SEO from "../seo";

import Header from "src/components/navigation/header";

export const Layout = ({ children }) => {
  return (
    <div>
      <SEO
        keywords={[`next`, `tailwind`, `react`, `tailwindcss`]}
        title="Home"
      />
      <Header />
      <div className="flex w-auto w-full flex-col sm:flex-row md:py-4 px-4 md:px-6">
        {children}
      </div>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
