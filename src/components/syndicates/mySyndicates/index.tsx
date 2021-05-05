import { showWalletModal } from "@/redux/actions";
import { addSyndicates } from "@/redux/actions/syndicates";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Button from "src/components/buttons";
import PageHeader from "src/components/pageHeader";
import CreateSyndicate from "src/components/syndicates/createSyndicate";
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
    web3: { syndicateInstance, account },
    syndicates,
    dispatch,
    loading,
  } = props;

  // Assume by default this user has an open syndicate
  const [managerWithOpenSyndicate, setManagerWithOpenSyndicate] = useState(
    true
  );

  // Find whether there is a syndicate address that matches the connected
  // wallet account. If so, the account has an open syndicate, else the account
  // does not have an open syndicate.
  useEffect(() => {
    if (syndicates.length) {
      const syndicateAddresses = [];
      syndicates.forEach((syndicate) => {
        syndicateAddresses.push(syndicate.address);
      });
      const accountHasSyndicate = syndicateAddresses.find(
        (address) => address == account
      );
      if (accountHasSyndicate) {
        setManagerWithOpenSyndicate(true);
      }
    } else {
      setManagerWithOpenSyndicate(false);
    }
  }, [syndicates, syndicateInstance]);

  /**
   * We need to be sure syndicateInstance is initialized before retrieving events.
   */
  useEffect(() => {
    console.log({ syndicateInstance });
    if (syndicateInstance) {
      dispatch(addSyndicates(props.web3));
    }
  }, [syndicateInstance]);

  // active syndicates are shown from this object
  const activeSyndicates = syndicates.filter((syndicate) => {
    return syndicate.active;
  });

  // inactive syndicate do not have custom styling like above
  const inActiveSyndicates = syndicates.filter(
    (syndicate) => !syndicate.active
  );

  // controls show/hide new syndicate creation modal
  const [showModal, setShowModal] = useState(false);

  const showSyndicateForm = () => {
    // Trigger wallet connection if wallet is not connected
    if (!syndicateInstance) {
      return dispatch(showWalletModal());
    }
    setShowModal(true);
  };


  return (
    <div className="mt-4">
      {!loading ? (
        <>
          {/* Show page header and button to create new syndicate */}
          <div className="flex justify-between w-full">
            <div>
              {activeSyndicates.length ? (
                <PageHeader>Your Syndicates</PageHeader>
              ) : null}
            </div>

            <div className="mb-2 ">
              {account && !managerWithOpenSyndicate ? (
                <Button
                  customClasses="border border-white h-12 w-48 p-3 pt-3 text-sm"
                  onClick={showSyndicateForm}>
                  Create a syndicate
                </Button>
              ) : null}
            </div>
          </div>
          {syndicates.length ? (
            <>
              {/* show active syndicates here */}
              {activeSyndicates.length ? (
                <div>
                  <ActiveSyndicates syndicates={activeSyndicates} />
                </div>
              ) : null}

              {/* show inactive syndicates here */}
              {inActiveSyndicates.length ? (
                <div className="mt-8">
                  <PageHeader>Other Syndicatesß</PageHeader>
                  <InActiveSyndicates syndicates={inActiveSyndicates} />
                </div>
              ) : null}
            </>
          ) : account ? (
            // if connected, then it means no syndicates for this wallet
            <div className="flex justify-center text-center flex-col">
              <p className="text-2xl">
                There are no syndicates you are leading or have invested in at
                the moment.
              </p>
              <p className="text-2xl">Please create a new syndicate</p>
            </div>
          ) : (
            // Account = undefined means wallet not connected, hence we are
            // not sure whether the wallet onwer has syndicates or not
            <div className="flex justify-center text-center flex-col">
              <p className="text-2xl">
                It seems your wallet account is not connected to this
                application
              </p>
              <p className="text-2xl">
                Please <span className="text-blue-300">click</span> the button
                labelled{" "}
                <span className="text-blue-light mr-1">Not connected</span>
                on the navbar to get started.
              </p>
            </div>
          )}
        </>
      ) : (
        // show some animations during loading process
        <div className="loader"></div>
      )}

      {/* Component to create syndicate  */}
      {syndicateInstance ? (
        <CreateSyndicate {...{ showModal, setShowModal }} />
      ) : null}
    </div>
  );
};

MySyndicates.propTypes = {
  props: PropTypes.any,
};

const mapStateToProps = (state) => {
  const { web3Reducer, syndicatesReducer, loadingReducer } = state;
  const { web3 } = web3Reducer;
  const { syndicates } = syndicatesReducer;
  const { loading } = loadingReducer;

  return { web3, syndicates, loading };
};

MySyndicates.propTypes = {
  syndicates: PropTypes.any,
  syndicateInstance: PropTypes.any,
  web3: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.bool,
};

export default connect(mapStateToProps)(MySyndicates);
