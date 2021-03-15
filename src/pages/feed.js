import React from "react";
import PropTypes from "prop-types";

import Layout from "src/components/layout";

// Social page components
import SocialFeed from "src/components/socialPage/socialFeed";
import Discovery from "src/components/socialPage/discovery";

/**
 * Manages feeds page
 */
const FeedPage = () => {
  return (
    <Layout>
      <SocialFeed />
      <Discovery />
    </Layout>
  );
};

FeedPage.propTypes = {
  props: PropTypes.any,
};

export default FeedPage;
