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

  const [syndicates, setSyndicatesAmLeading] = useState([]);

  const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
  console.log({ syndicates });

  const getAllEvents = async () => {
    try {
      const currentBlock = await web3.eth.getBlockNumber();

      web3contractInstance
        .getPastEvents("allEvents", {
          fromBlock: currentBlock - 10,
          toBlock: "latest",
        })
        .then(function (events) {
          console.log({ events });
          const syndicates = [];

          events.forEach((event) => {
            const { syndicateAddress } = event.returnValues;
            // check whether event belongs to this wallet owner
            if (
              event.event === "createdSyndicate" &&
              syndicateAddress === account
            ) {
              const {
                allowlistEnabled,
                closeDate,
                depositERC20ContractAddress,
                maxDeposit,
                maxTotalDeposits,
                syndicateAddress,
                syndicateProfitSharePercent,
                timestamp,
                syndicateOpen,
                inactive,
                distributionsEnabled,
              } = event.returnValues;

              syndicates.push({
                allowlistEnabled,
                // we need to convert the date string to number
                closeDate: formatDate(new Date(parseInt(closeDate))),
                createdDate: formatDate(new Date(timestamp * 1000)), // timestamp is in seconds
                depositERC20ContractAddress,
                maxDeposit,
                maxTotalDeposits,
                address: syndicateAddress,
                syndicateProfitSharePercent:
                  parseInt(web3.utils.fromWei(syndicateProfitSharePercent)) /
                  1000,
                syndicateOpen,
                inactive,
                distributionsEnabled,
              });
            }
            console.log(event.event);

            // get syndicates this wallet has invested in
            if (event.event === "lpInvestedInSyndicate") {
              const address = event.returnValues["0"];
              const lpAddress = event.returnValues["1"];

              // we need to check whether lpAddress matches this wallet account
              // meaning this account has invested in this wallet
              if (lpAddress === account) {
                // we use default for fields missing in the event
                // syndicate details will be retrieved during display
                syndicates.push({
                  allowlistEnabled: false,
                  closeDate: formatDate(new Date()),
                  createdDate: formatDate(new Date()),
                  depositERC20ContractAddress: null,
                  maxDeposit: 0,
                  maxTotalDeposits: 0,
                  address,
                  syndicateProfitSharePercent: 0.3,
                  syndicateOpen: false,
                  inactive: false,
                  distributionsEnabled: false,
                });
              }
            }
          });

          /**
           * wallet might have send several investments and thus many events
           * for the same use are emitted. We process all the events and the get
           * a single syndicate, hence the filtering below.
           */
          const filteredSyndicates = syndicates.reduce((acc, current) => {
            const x = acc.find((item) => item.address === current.address);
            if (!x) {
              return acc.concat([current]);
            } else {
              return acc;
            }
          }, []);

          setSyndicatesAmLeading(filteredSyndicates);
        });
    } catch (error) {
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
