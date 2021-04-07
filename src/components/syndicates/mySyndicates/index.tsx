import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import PageHeader from "src/components/pageHeader";
import { formatDate } from "src/utils";
import Web3 from "web3";
import {
  default as ActiveSyndicates,
  default as InActiveSyndicates,
} from "./activeSyndicates";

type Depositors = {
  address?: {
    depositors?: number;
  };
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
  const {
    web3: { syndicateInstance, account, web3contractInstance },
  } = props;

  const [syndicates, setSyndicates] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);

  const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");

  /**
   * retrieves details for a given syndicate
   */
  const getSyndicate = async (address: string) => {
    try {
      const syndicateData = await syndicateInstance.getSyndicateValues(address);
      const closeDate = formatDate(
        new Date(syndicateData.closeDate.toNumber())
      );
      const createdDate = formatDate(
        new Date(syndicateData.creationDate.toNumber() * 1000)
      );
      const openToDeposits = syndicateData.syndicateOpen;

      const totalDeposits = web3.utils.fromWei(
        syndicateData.totalDeposits.toString()
      );

      const maxTotalDeposits = web3.utils.fromWei(
        syndicateData.maxTotalDeposits.toString()
      );

      return {
        address,
        openToDeposits,
        closeDate,
        maxTotalDeposits,
        totalDeposits,
        createdDate,
        inactive: syndicateData.inactive,
      };
    } catch (error) {
      console.log({ error });
    }
  };

  const getAllEvents = async () => {
    try {
      setLoading(true);
      const currentBlock = await web3.eth.getBlockNumber();

      web3contractInstance
        .getPastEvents("allEvents", {
          fromBlock: currentBlock - 10,
          toBlock: "latest",
        })
        .then((events) => {
          const syndicates = [];
          const syndicateDepositors: Depositors = {};

          events.forEach((event) => {
            const { syndicateAddress } = event.returnValues;
            // check whether event belongs to this wallet owner
            if (
              event.event === "createdSyndicate" &&
              syndicateAddress === account
            ) {
              syndicates.push(syndicateAddress);
            }

            // get syndicates this wallet has invested in
            if (event.event === "lpInvestedInSyndicate") {
              const address = event.returnValues["0"];
              const lpAddress = event.returnValues["1"];

              // record depositors for each address
              if (syndicateDepositors.address) {
                syndicateDepositors.address.depositors += 1;
              } else {
                syndicateDepositors.address.depositors = 0;
              }

              if (lpAddress === account) {
                // we need to check whether lpAddress matches this wallet account
                // meaning this account has invested in this wallet
                // we use default for fields missing in the event
                // syndicate details will be retrieved during display
                syndicates.push(address);
              }
            }
          });

          /**
           * wallet might have send several investments and thus many events
           * for the same use are emitted. We process all the events and the get
           * a single syndicate, hence the filtering below.
           */
          const filteredSyndicateAddresses = syndicates.reduce(
            (acc, current) => {
              const x = acc.find((item) => item === current);
              if (!x) {
                return acc.concat([current]);
              } else {
                return acc;
              }
            },
            []
          );

          /**
           * Get syndicate details for all address of obtained from events
           */
          filteredSyndicateAddresses.forEach(async (address) => {
            try {
              const syndicate = await getSyndicate(address);
              /**
               * We check whether we have data returned; for the case of an error,
               * the returned value is undefined
               */
              if (syndicate) {
                setSyndicates([
                  ...syndicates,
                  {
                    ...syndicate,
                    depositors: syndicateDepositors.address?.depositors || 0,
                  },
                ]);

                return syndicate;
              }
            } catch (error) {
              console.error({ message: "Error retrieving syndicate data" });
            }
          });
          setLoading(false);
        });
    } catch (error) {
      setLoading(false);

      console.log({
        error,
        message: "An error occured while retrieving all events",
      });
    }
  };

  /**
   * We need to be sure syndicateInstance is initialized before retrieving events.
   */
  useEffect(() => {
    if (syndicateInstance) {
      getAllEvents();
    }
  }, [syndicateInstance]);

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
      {!loading ? (
        <>
          {/* show active syndicates here */}
          {activeSyndicates.length ? (
            <div>
              <PageHeader>Active</PageHeader>
              <ActiveSyndicates syndicates={activeSyndicates} />
            </div>
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
        </>
      ) : (
        "Hang tight. We are rerieving your syndicates"
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
  syndicateInstance: PropTypes.any,
  web3: PropTypes.object,
};

export default connect(mapStateToProps)(MySyndicates);
