import React from "react";

import Layout from "src/components/layout";

// Social page components
import SocialFeed from "src/components/socialPage/socialFeed";
import Discovery from "src/components/socialPage/discovery";

const SocialPage = () => {
  return (
    <Layout>
      <SocialFeed />
      <Discovery />
    </Layout>
  );
};

export default SocialPage;
