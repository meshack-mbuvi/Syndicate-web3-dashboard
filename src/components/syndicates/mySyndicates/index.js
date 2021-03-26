import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import ActiveSyndicates from "./activeSyndicates";
import InActiveSyndicates from "./activeSyndicates";

import PageHeader from "src/components/pageHeader";

const styles = ["lawn-green", "pinky-blue", "yellowish-light-blue"];
const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

/**
 * My Syndicates: IF their wallet (a) is leading a syndicate or
 * (b) has deposited into a syndicate, the syndicates shows up on
 * this list. If the syndicate has been marked by the lead as
 *  “inactive,” the syndicate shows up in the inactive list.
 * Data is pulled from the smart contract and syndicate’s wallet state.
 * @returns
 */
const MySyndicates = (props) => {
  shuffle(styles);
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
      styles: styles[0],
      maxTotalDeposits: 100000,
      inactive: false,
      syndicateOpen: true,
      distributionsEnabled: false,
    },
    // {
    //   address: "0x8895BD7C5d81d48B4F4f655643cf96d3B3B26924",
    //   createdDate: new Date(),
    //   closeDate: new Date(),
    //   depositors: 60000,
    //   deposits: 100,
    //   activity: "-",
    //   distributions: "-",
    //   myDeposits: 1000,
    //   myWithdraws: "-",
    //   styles: styles[1],
    //   inactive: false,
    //   maxTotalDeposits: 100000,
    //   syndicateOpen: true,
    //   distributionsEnabled: false,
    // },
    // {
    //   address: "0xa4d7a0C6Fa256C017f68EBFa76307dEDD69e12Df",
    //   createdDate: new Date(),
    //   closeDate: new Date(),
    //   depositors: 60000,
    //   deposits: 100,
    //   activity: "-",
    //   distributions: "-",
    //   myDeposits: 1000,
    //   myWithdraws: "-",
    //   styles: styles[2],
    //   maxTotalDeposits: 100000,
    //   inactive: false,
    //   syndicateOpen: true,
    //   distributionsEnabled: false,
    // },
    // {
    //   address: "0xa4d7a0C6Fa256C017f68EBFa76307dEDD69e12sa",
    //   createdDate: new Date(),
    //   closeDate: new Date(),
    //   depositors: 60000,
    //   deposits: 100,
    //   activity: "-",
    //   distributions: "-",
    //   myDeposits: 1000,
    //   myWithdraws: "-",
    //   maxTotalDeposits: 100000,
    //   inactive: true,
    //   distributionsEnabled: false,
    // },
    // {
    //   address: "0xa4d7a0C6Fa256C017f68EBFa76307dEDD69e12DE",
    //   createdDate: new Date(),
    //   closeDate: new Date(),
    //   depositors: 60000,
    //   deposits: 100,
    //   activity: "-",
    //   distributions: "-",
    //   myDeposits: 1000,
    //   maxTotalDeposits: 100000,
    //   myWithdraws: "-",
    //   inactive: true,
    //   distributionsEnabled: false,
    // },
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
      <ActiveSyndicates syndicates={activeSyndicates} />
      {/* show inactive syndicates here */}
      <div className="mt-8">
        <PageHeader>Inactive</PageHeader>
        <InActiveSyndicates syndicates={inActiveSyndicates} />
      </div>
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

export default connect(mapStateToProps)(MySyndicates);
