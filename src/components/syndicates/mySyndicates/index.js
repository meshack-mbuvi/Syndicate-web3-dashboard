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

const getRandomStyle = () => {
  const index = Math.floor(Math.random() * styles.length);
  return styles[index];
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

  // active syndicates are shown from this object
  const activeSyndicates = [
    {
      address: "0xa4d7a0C6Fa256C017f68EBFa76307dEDD69e12sa",
      createdDate: new Date(),
      closeDate: new Date(),
      depositors: 60000,
      deposits: 10000000,
      activity: "-",
      distributions: "-",
      myDeposits: 1000,
      myWithdraws: "-",
      styles: styles[0],
    },
    {
      address: "0xa4d7a0C6Fa256C017f68EBFa76307dEDD69e12DE",
      createdDate: new Date(),
      closeDate: new Date(),
      depositors: 60000,
      deposits: 10000000,
      activity: "-",
      distributions: "-",
      myDeposits: 1000,
      myWithdraws: "-",
      styles: styles[1],
    },
    {
      address: "0xa4d7a0C6Fa256C017f68EBFa76307dEDD69e12Df",
      createdDate: new Date(),
      closeDate: new Date(),
      depositors: 60000,
      deposits: 10000000,
      activity: "-",
      distributions: "-",
      myDeposits: 1000,
      myWithdraws: "-",
      styles: styles[2],
    },
  ];

  // inactive syndicate do not have custom styling like above
  const inActiveSyndicates = [
    {
      address: "0xa4d7a0C6Fa256C017f68EBFa76307dEDD69e12sa",
      createdDate: new Date(),
      closeDate: new Date(),
      depositors: 60000,
      deposits: 10000000,
      activity: "-",
      distributions: "-",
      myDeposits: 1000,
      myWithdraws: "-",
    },
    {
      address: "0xa4d7a0C6Fa256C017f68EBFa76307dEDD69e12DE",
      createdDate: new Date(),
      closeDate: new Date(),
      depositors: 60000,
      deposits: 10000000,
      activity: "-",
      distributions: "-",
      myDeposits: 1000,
      myWithdraws: "-",
    },
  ];
  const [provider, setProvider] = useState(null);
  const { web3 } = props;

  const { syndicateInstance } = web3;
  useEffect(() => {
    setProvider(syndicateInstance?.provider);
  }, [syndicateInstance]);

  useEffect(() => {
    if (provider) {
      try {
        provider.getEvents().then((events) => console.log({ events }));

        provider.getNetwork().then((network) => console.log(network));
      } catch (error) {
        console.log({ error });
      }
    }
  }, [provider]);

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
