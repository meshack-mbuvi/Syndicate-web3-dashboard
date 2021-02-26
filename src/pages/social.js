import React from "react";

import Layout from "src/components/layout";

// Social page components
import SocialFeed from "src/components/socialPage/socialFeed";
import Discovery from "src/components/socialPage/discovery";

import Modal from "src/components/modal";

const SocialPage = () => {
  // const [showModal] = useState(true);
  return (
    <Layout>
      <SocialFeed />
      <Discovery />
      <Modal />
    </Layout>
  );
};

export default SocialPage;
