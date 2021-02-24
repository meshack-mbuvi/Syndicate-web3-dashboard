import React from "react";

import Layout from "../components/layout";

// Social page components
import SocialFeed from "../components/socialPage/socialFeed";
import Discovery from "../components/socialPage/discovery";

const SocialPage = () => {
  return (
    <Layout>
      <SocialFeed />
      <Discovery />
    </Layout>
  );
};

export default SocialPage;
