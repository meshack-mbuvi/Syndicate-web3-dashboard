import React from "react";

import Layout from "../components/layout";
import SEO from "../components/seo";
// import Button from "../components/button";
// import { Link } from "gatsby";

// Other components
import Header from "../components/navigation/header";
import Sidebar from "../components/navigation/sidebar";
import { SideBarNavItem } from "../components/navigation/sidebar/sidebar-item";

// constants
import { sidebarLinks } from "../utils/sidebarLinks";

function DashboardPage() {
  return (
    <Layout>
      <SEO
        keywords={[`gatsby`, `tailwind`, `react`, `tailwindcss`]}
        title="Home"
      />
      <Header />

      <Sidebar>
        {sidebarLinks.map(({ url, urlText }) => (
          <SideBarNavItem {...{ url, urlText }} key={url} />
        ))}
      </Sidebar>
    </Layout>
  );
}

export default DashboardPage;
