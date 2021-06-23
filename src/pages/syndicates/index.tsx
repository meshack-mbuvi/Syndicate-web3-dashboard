// This page lists all syndicates.
import React from "react";
import dynamic from "next/dynamic";

const Syndicates = dynamic(() => import("src/containers/syndicates"), {
  ssr: false,
});

const SyndicatesPage = () => {
  return <Syndicates />;
};

export default SyndicatesPage;
