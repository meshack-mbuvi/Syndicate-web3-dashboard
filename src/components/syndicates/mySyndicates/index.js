import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import ActiveSyndicates from "./activeSyndicates";
import InActiveSyndicates from "./activeSyndicates";

import PageHeader from "src/components/pageHeader";

/**
 * My Syndicates: IF their wallet (a) is leading a syndicate or
 * (b) has deposited into a syndicate, the syndicates shows up on
 * this list. If the syndicate has been marked by the lead as
 *  “inactive,” the syndicate shows up in the inactive list.
 * Data is pulled from the smart contract and syndicate’s wallet state.
 * @returns
 */
const MySyndicates = () => {
  const syndicates = [
    {
      address: "0x8895BD7C5d81d48B4F4f655643cf96d3B3B26924",
      createdDate: new Date(),
      closeDate: new Date(),
      depositors: 60000,
      deposits: 100,
      activity: "-",
      distributions: "-",
      myDeposits: 1000,
      myWithdraws: "-",
      maxTotalDeposits: 100000,
      inactive: false,
      syndicateOpen: true,
      distributionsEnabled: false,
    },
  ];

  // active syndicates are shown from this object
  const activeSyndicates = syndicates.filter(
    (syndicate) => syndicate.inactive === false
  );

  // inactive syndicate do not have custom styling like above
  const inActiveSyndicates = syndicates.filter(
    (syndicate) => syndicate.inactive === true
  );

  return (
    <div className="mt-4">
      {/* show active syndicates here */}
      {activeSyndicates.length ? (
        <ActiveSyndicates syndicates={activeSyndicates} />
      ) : (
        ""
      )}

      {/* show inactive syndicates here */}
      {inActiveSyndicates.length ? (
        <div className="mt-8">
          <PageHeader>Inactive</PageHeader>
          <InActiveSyndicates syndicates={inActiveSyndicates} />
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

MySyndicates.propTypes = {
  props: PropTypes.any,
};

const mapStateToProps = ({ web3Reducer }) => {
  const { web3 } = web3Reducer;
  return { web3 };
};

MySyndicates.propTypes = {
  syndicates: PropTypes.any,
};

export default connect(mapStateToProps)(MySyndicates);
