import React from "react";
import PropTypes from "prop-types";
import Head from "src/components/syndicates/shared/HeaderTitle";

// Social page components
import SocialFeed from "./socialFeed";
import Discovery from "./discovery";
import Layout from "src/components/layout";

/**
 * Manages feeds page
 */
const FeedPage = () => {
  return (
    <Layout>
      <Head title="Social" />
      <SocialFeed />
      <Discovery />
    </Layout>
  );
};

FeedPage.propTypes = {
  props: PropTypes.any,
};

export default FeedPage;
