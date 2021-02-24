import React from "react";

// Layout wrappers
import Layout from "../components/layout";
import ContentWrapper from "../components/layout/content-wrapper";

import SEO from "../components/seo";

// Other components
import Header from "../components/navigation/header";
import Sidebar from "../components/navigation/sidebar";
import { SideBarNavItem } from "../components/navigation/sidebar/sidebar-item";

// constants
import { sidebarLinks } from "../utils/sidebarLinks";

const SocialPage = () => {
  return (
    <Layout>
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

        <ContentWrapper>
          <div className="w-3/4">Social feed</div>
          <div>Dicsove</div>
        </ContentWrapper>
      </div>
    </Layout>
  );
};

export default SocialPage;
