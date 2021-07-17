import { showWalletModal } from "@/redux/actions";
import { setOneSyndicatePerAccount } from "@/redux/actions/syndicateMemberDetails";
import { getSyndicates } from "@/redux/actions/syndicates";
import { RootState } from "@/redux/store";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "src/components/buttons";
import { SkeletonLoader } from "src/components/skeletonLoader";
import CreateSyndicate from "src/components/syndicates/createSyndicate";
import { default as Portfolio } from "./portfolio";
import { CLICK_CREATE_A_SYNDICATE } from "@/components/amplitude/eventNames";
import { amplitudeLogger, Flow } from "@/components/amplitude";

/**
 * My Syndicates: IF their wallet (a) is leading a syndicate or
 * (b) has deposited into a syndicate, the syndicates shows up on
 * this list. If the syndicate has been marked by the lead as
 *  “inactive,” the syndicate shows up in the inactive list.
 * Data is pulled from the smart contract and syndicate’s wallet state.
 * @returns
 */
const PortfolioAndDiscover = () => {
  const dispatch = useDispatch();

  const {
    loadingReducer: { loading },
    initializeContractsReducer: { syndicateContracts },
    syndicatesReducer: { syndicates },
    web3Reducer: { web3 },
  } = useSelector((state: RootState) => state);
  const { account } = web3;

  const [showModal, setShowModal] = useState(false);

  /**
   * We need to be sure syndicateContracts is initialized before retrieving events.
   */
  useEffect(() => {
    if (syndicateContracts?.GetterLogicContract) {
      dispatch(getSyndicates({ ...web3, ...syndicateContracts }));
    }
  }, [account]);

  // Assume by default this user has an open syndicate
  const [managerWithOpenSyndicate, setManagerWithOpenSyndicate] = useState(
    true,
  );

  // Find whether there is a syndicate address that matches the connected
  // wallet account. If so, the account has an open syndicate, else the account
  // does not have an open syndicate.
  useEffect(() => {
    if (syndicates.length) {
      const syndicateAddresses = [];
      syndicates.forEach((syndicate) => {
        syndicateAddresses.push(syndicate.syndicateAddress);
      });
      const accountHasSyndicate = syndicateAddresses.find(
        (address) => address == account,
      );
      if (accountHasSyndicate) {
        setManagerWithOpenSyndicate(true);
      } else {
        setManagerWithOpenSyndicate(false);
      }
    } else {
      setManagerWithOpenSyndicate(false);
      dispatch(setOneSyndicatePerAccount(false));
    }
  }, [syndicates, account]);

  const showSyndicateForm = () => {
    // Trigger wallet connection if wallet is not connected
    if (!account) {
      return dispatch(showWalletModal());
    }
    setShowModal(true);

    // Amplitude logger: How many users clicked on the "Create a Syndicate" button
    amplitudeLogger(CLICK_CREATE_A_SYNDICATE, { flow: Flow.MGR_CREATE_SYN });
  };

  // generate multiple skeleton loader components
  const generateSkeletons = (
    num: number,
    width: string,
    height: string,
    borderRadius?: string,
  ) => {
    const skeletonsWrapper = [];
    for (let i = 0; i < num; i++) {
      skeletonsWrapper.push(
        <div className="px-2 w-full" key={i}>
          <SkeletonLoader
            width={width}
            height={height}
            borderRadius={borderRadius}
          ></SkeletonLoader>
        </div>,
      );
    }
    return skeletonsWrapper;
  };

  return (
    <div className="mt-2">
      {loading && account ? (
        // show some animations during loading process
        // skeleton loader
        <div>
          <div className="flex w-full justify-end mb-10">
            <SkeletonLoader
              width="40"
              height="10"
              borderRadius="rounded-full"
            />
          </div>
          <div className="mt-8">
            <div className="grid grid-cols-6">
              {generateSkeletons(6, "30", "8", "rounded-md")}
            </div>
            <div className="mt-6">
              {[1, 2].map((index) => {
                return (
                  <div className="grid grid-cols-6" key={index}>
                    <div className="flex justify-between items-center w-full px-2">
                      <SkeletonLoader
                        width="7"
                        height="7"
                        borderRadius="rounded-full"
                      />
                      <SkeletonLoader
                        width="2/3"
                        height="8"
                        borderRadius="rounded-md"
                      />
                    </div>
                    {generateSkeletons(4, "30", "8", "rounded-md")}
                    {generateSkeletons(1, "30", "8", "rounded-full")}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Show page header and button to create new syndicate */}
          <div className="flex justify-end w-full">
            <div className="mb-2">
              {account && syndicates.length ? (
                <Button
                  customClasses="border border-gray-5 font-whyte-light w-56 rounded-full bg-gray-4 h-12 w-48 p-3 pt-3 text-sm"
                  onClick={
                    managerWithOpenSyndicate
                      ? () => dispatch(setOneSyndicatePerAccount(true))
                      : () => showSyndicateForm()
                  }
                  createSyndicate={true}
                >
                  Create a syndicate
                </Button>
              ) : null}
            </div>
          </div>
          {syndicates.length ? (
            <>
              {/* show active syndicates here */}
              {syndicates.length ? (
                <div>
                  <Portfolio syndicates={syndicates} />
                </div>
              ) : null}
            </>
          ) : account && !syndicates.length ? (
            // if connected, then it means no syndicates for this wallet
            <div className="flex justify-center text-center flex-col">
              <p className="text-2xl font-whyte-light">
                There are no syndicates you are leading or have invested in at
                the moment.
              </p>
              <Button
                customClasses="border border-gray-5 self-center mt-6 font-whyte-light w-56 rounded-full bg-gray-4 h-12 w-48 p-3 pt-3 text-sm"
                onClick={showSyndicateForm}
                createSyndicate={true}
              >
                Create a syndicate
              </Button>
            </div>
          ) : !account ? (
            <div className="flex justify-center items-center h-full w-full mt-6 sm:mt-10">
              <div className="flex flex-col items-center justify-center sm:w-7/12 md:w-5/12 rounded-custom bg-gray-6 p-10">
                <div className="w-full flex justify-center mb-6">
                  <img src="/images/exclamation.svg" className="h-12 w-12" alt="error"/>
                </div>
                <p className="font-semibold text-2xl text-center">
                  Wallet Not Connected
                </p>
                <p className="text-sm my-5 font-normal text-gray-dim text-center">
                 Connect a wallet account to continue
                </p>
              </div>
            </div>
          ) : null}
        </>
      )}
      {/* Component to create syndicate  */}
      {account ? <CreateSyndicate {...{ showModal, setShowModal }} /> : null}
    </div>
  );
};

export default PortfolioAndDiscover;
