import React from "react";

import Layout from "src/components/layout";

// Social page components
import SocialFeed from "src/components/socialPage/socialFeed";
import Discovery from "src/components/socialPage/discovery";
// import ConnectWallet from "src/components/connectWallet";

import Modal from "src/components/modal";

const SocialPage = () => {
  // const [showModal] = useState(true);
  return (
    <Layout>
      <SocialFeed />
      <Discovery />

      {/* connect wallet we need to find a way to control
       when this component is fired up*/}
      {/* <ConnectWallet /> */}
    </Layout>
  );
};

export default SocialPage;
