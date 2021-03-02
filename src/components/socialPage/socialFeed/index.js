import React, { useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { useWeb3React } from "@web3-react/core";

import PageHeader from "src/components/pageHeader";

import { SocialFeedAnimatedLoader } from "./socialFeedAnimatedLoader";

/**
 * Renders feeds on socialPage. During loading, loading animation is
 * shown until the content is loaded
 */
const SocialFeed = () => {
  const { library } = useWeb3React();

  const [isLoading] = useState(true);
  return (
    <div className="w-3/4 mr-4">
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
