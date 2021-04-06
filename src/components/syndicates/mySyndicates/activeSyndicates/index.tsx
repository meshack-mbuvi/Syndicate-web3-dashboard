import PropTypes from "prop-types";
import React from "react";
import SyndicateItem, { Header } from "../../shared";

const styles = [
  "lawn-green",
  "pinky-blue",
  "yellowish-light-blue",
  "violet-red",
  "violet-yellow",
];

export const ActiveSyndicates = (props) => {
  const { syndicates } = props;
  console.log({ syndicates }, "act");
  return (
    <div className="mt-4">
      <Header />
      {syndicates.map((syndicate, index) => (
        <SyndicateItem
          key={syndicate.address}
          {...syndicate}
          styles={styles[index]}
        />
      ))}
    </div>
  );
};

ActiveSyndicates.propTypes = {
  syndicates: PropTypes.any,
};

export default ActiveSyndicates;
