import React, { useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import PageHeader from "src/components/pageHeader";

import { SocialFeedAnimatedLoader } from "./socialFeedAnimatedLoader";

/**
 * Renders feeds on socialPage. During loading, loading animation is
 * shown until the content is loaded
 */
const SocialFeed = () => {
  const [isLoading] = useState(true);
  return (
    <div className="w-full sm:w-3/4 mr-4 mt-4">
      <PageHeader>Social Feed</PageHeader>
      {isLoading ? (
        <SocialFeedAnimatedLoader />
      ) : (
        "We show the loaded contents here"
      )}
    </div>
  );
};

SocialFeed.propTypes = {
  props: PropTypes.any,
};

const mapStateToProps = (state) => {
  return { state };
};
export default connect(mapStateToProps, null)(SocialFeed);
