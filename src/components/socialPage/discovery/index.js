import React from "react";

import PageHeader from "src/components/pageHeader";
import { DiscoverAnimatedLoader } from "./discoverAnimatedLoader";

const Discovery = () => {
  return (
    <div className="w-1/4">
      <PageHeader>Discovery </PageHeader>
      <DiscoverAnimatedLoader />
    </div>
  );
};

export default Discovery;
