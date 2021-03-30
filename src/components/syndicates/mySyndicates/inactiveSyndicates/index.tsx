import React from "react";
import SyndicateItem, { Header } from "../../shared";

export const InActiveSyndicates = (props) => {
  const { syndicates } = props;
  return (
    <div className="mt-4">
      <Header />
      {syndicates.map((syndicate) => (
        <SyndicateItem key={syndicate.address} {...syndicate} />
      ))}
    </div>
  );
};

export default InActiveSyndicates;
