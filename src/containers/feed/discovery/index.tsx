import React from "react";
import PropTypes from "prop-types";

import PageHeader from "src/components/pageHeader";
import { DiscoverAnimatedLoader } from "./discoverAnimatedLoader";

const Discovery = () => {
  return (
    <div className="sm:w-1/4 mt-4">
      <PageHeader>Discovery </PageHeader>
      <DiscoverAnimatedLoader />
    </div>
  );
};

Discovery.propTypes = {
  props: PropTypes.any,
};

export default Discovery;
