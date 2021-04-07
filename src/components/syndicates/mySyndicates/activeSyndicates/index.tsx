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
  return (
    <div className="mt-4">
      <Header />
      {syndicates
        ? syndicates.map((syndicate, index) => (
            <SyndicateItem
              key={syndicate.address}
              {...syndicate}
              styles={styles[index]}
            />
          ))
        : "No syndicates currently"}
    </div>
  );
};

ActiveSyndicates.propTypes = {
  syndicates: PropTypes.any,
};

export default ActiveSyndicates;
