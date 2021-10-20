import { amplitudeLogger, Flow } from "@/components/amplitude";
import { CLICK_CREATE_A_SYNDICATE } from "@/components/amplitude/eventNames";
import WalletNotConnected from "@/components/walletNotConnected";
import { showWalletModal } from "@/state/wallet/actions";
import { setOneSyndicatePerAccount } from "@/redux/actions/syndicateMemberDetails";
import { getSyndicates } from "@/redux/actions/syndicates";
import { SYNDICATE_BY_ADDRESS } from "@/redux/actions/types";
import { RootState } from "@/redux/store";
import router from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "src/components/buttons";
import { SkeletonLoader } from "src/components/skeletonLoader";
import CreateSyndicate from "src/components/syndicates/createSyndicate";
import { default as Portfolio } from "./portfolio";

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

  const {
    account,
    currentEthereumNetwork,
    ethereumNetwork: { invalidEthereumNetwork },
  } = web3;

  const [showModal, setShowModal] = useState(false);

  /**
   * We need to be sure syndicateContracts is initialized before retrieving events.
   */
  useEffect(() => {
    // This will reset syndicate details when we are on portfolio page.
    // The currentEthereumNetwork has been added as a dependency to trigger a re-fetch
    // whenever the Ethereum network is changed.
    dispatch({
      data: null,
      type: SYNDICATE_BY_ADDRESS,
    });
    if (syndicateContracts?.GetterLogicContract) {
      dispatch(getSyndicates({ ...web3, ...syndicateContracts }));
    }
  }, [account, currentEthereumNetwork]);

  // Assume by default this user has an open syndicate
  const [managerWithOpenSyndicate, setManagerWithOpenSyndicate] =
    useState(true);

  // Find whether there is a syndicate address that matches the connected
  // wallet account. If so, the account has an open syndicate, else the account
  // does not have an open syndicate.
  useEffect(() => {
    if (syndicates.length) {
      const syndicateAddresses = [];
      syndicates.forEach((syndicate) => {
        syndicateAddresses.push(syndicate.managerCurrent);
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

    router.replace("/syndicates/create");


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
          <div className="flex justify-between items-center w-full mb-10">
            {account && syndicates.length ? (
              <>
                <h1 className="main-title">Portfolio</h1>
                <Button
                  customClasses="secondary-CTA relative"
                  textColor="text-white"
                  onClick={
                    managerWithOpenSyndicate
                      ? () => dispatch(setOneSyndicatePerAccount(true))
                      : () => showSyndicateForm()
                  }
                  createSyndicate={true}
                >
                  <div className="hidden sm:block">Create a syndicate</div>
                  <div className="block sm:hidden">Create</div>
                </Button>
              </>
            ) : null}
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
          ) : account && !syndicates.length && !invalidEthereumNetwork ? (
            // if connected, then it means no syndicates for this wallet
            <div
              className="text-center flex-col"
              style={{ height: "calc(100vh - 300px)" }}
            >
              <div className="vertically-center">
                <p className="text-2xl font-whyte-light">
                  There are no syndicates you are leading or have invested in at
                  the moment.
                </p>
                <Button
                  customClasses="my-4 primary-CTA mx-auto"
                  textColor="text-black"
                  onClick={showSyndicateForm}
                  createSyndicate={true}
                >
                  Create a syndicate
                </Button>
              </div>
            </div>
          ) : !account ? (
            <WalletNotConnected />
          ) : null}
        </>
      )}
      {/* Component to create syndicate  */}
      {/* TODO: CreateSyndicate should be deleted */}
      {account ? <CreateSyndicate {...{ showModal, setShowModal }} /> : null}
    </div>
  );
};

export default PortfolioAndDiscover;
