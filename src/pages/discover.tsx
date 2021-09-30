// This is the discover page.
import withAuth from "@/lib/withAuth";
import React from "react";
import { DiscoverContent } from "src/containers/discover";

const DiscoverPage = () => {
  return <DiscoverContent />;
};

export default withAuth(DiscoverPage);
