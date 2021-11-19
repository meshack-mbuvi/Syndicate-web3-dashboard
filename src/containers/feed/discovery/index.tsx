import React from "react";
import PageHeader from "src/components/pageHeader";
import { DiscoverAnimatedLoader } from "./discoverAnimatedLoader";

const Discovery: React.FC = () => {
  return (
    <div className="sm:w-1/4 mt-4">
      <PageHeader>Discovery </PageHeader>
      <DiscoverAnimatedLoader />
    </div>
  );
};

export default Discovery;
