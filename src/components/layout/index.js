import React from "react";
import PropTypes from "prop-types";
import "./layout.css";

// Layout wrappers
import ContentWrapper from "./content-wrapper";

import SEO from "../seo";

// Other components
import Header from "../navigation/header";
import Sidebar from "../navigation/sidebar";
import { SideBarNavItem } from "../navigation/sidebar/sidebar-item";

// constants
import { sidebarLinks } from "../../utils/sidebarLinks";

export const Layout = ({ children }) => {
  return (
    <>
      <SEO
        keywords={[`gatsby`, `tailwind`, `react`, `tailwindcss`]}
        title="Home"
      />
      {/* Top bar component */}
      <Header />

      <div className="flex">
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
