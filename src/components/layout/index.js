import React from "react";
import PropTypes from "prop-types";
import "./layout.css";

// Layout wrappers
import ContentWrapper from "./content-wrapper";

import SEO from "../seo";

// Other components
import Header from "src/components/navigation/header";
import Sidebar from "src/components/navigation/sidebar";
import { SideBarNavItem } from "src/components/navigation/sidebar/sidebar-item";

// constants
import { sidebarLinks } from "src/utils/sidebarLinks";

export const Layout = ({ children }) => {
  return (
    <>
      <SEO
        keywords={[`gatsby`, `tailwind`, `react`, `tailwindcss`]}
        title="Home"
      />
      {/* Top bar component */}
      <Header />

      <div className="flex main">
        <Sidebar>
          {sidebarLinks.map(({ url, urlText }) => (
            <SideBarNavItem {...{ url, urlText }} key={url} />
          ))}
        </Sidebar>

        <ContentWrapper>{children}</ContentWrapper>
      </div>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
