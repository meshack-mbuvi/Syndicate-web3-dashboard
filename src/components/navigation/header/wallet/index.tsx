import { oneSyndicatePerAccountText } from "@/components/syndicates/shared/Constants";
import { setOneSyndicatePerAccount } from "@/redux/actions/syndicateMemberDetails";
import { showWalletModal } from "@/redux/actions/web3Provider";
import { Menu, Transition } from "@headlessui/react";
import { useRouter } from "next/router";

import React, { useState } from "react";
import Joyride from "react-joyride";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/redux/store";
import AddressMenuDropDown from "./accountMenuDropdown";

export const Wallet: React.FC = () => {
  /**
   * This web3 is coming from the provider that is connected using the
   * hook web3modal.
   * The instance is in the application's store and is passed here as props
   */
  const { web3 } = useSelector((state: RootState) => state.web3Reducer);

  const { status } = web3;
  const dispatch = useDispatch();

  const { oneSyndicatePerAccount } = useSelector(
    (state: RootState) => state.syndicateMemberDetailsReducer,
  );

  const router = useRouter();

  const [steps] = useState([
    {
      target: ".wallet-connect",
      content: oneSyndicatePerAccountText,
      disableBeacon: true,
      offset: -5,
      isFixed: true,
    },
  ]);

  /**
   * open variable is used to determine whether to show or hide
   *  the wallet connection modal.
   */
  const connectWallet = () => {
    dispatch(setOneSyndicatePerAccount(false));
    dispatch(showWalletModal());
  };

  // custom component used in place of the default tooltip component to
  // indicate that the user cannot create another syndicate with the same address.
  // documentation: https://docs.react-joyride.com/custom-components
  const Tooltip = ({ tooltipProps, step }) => (
    <div
      className="bg-gray-dark rounded-custom w-64 px-6 py-4"
      {...tooltipProps}
    >
      <div className="mb-2 w-full flex justify-center">
        <img
          className="h-6 w-6 opacity-50"
          src="/images/chevron-up.svg"
          alt="down-arrow"
        />
      </div>
      <p className="font-whyte-light text-white text-sm text-center">
        {step.content}
      </p>
    </div>
  );

  /** method to reset the one syndicate per account state in the redux store
   * We'll disable this like so for the user to be able to get the same notification
   * after closing the tooltip and clicking on 'create a syndicate` again.
   * documentation: https://docs.react-joyride.com/callback
   */
  const handleClose = (data) => {
    const { action } = data;
    if (action === "reset") {
      dispatch(setOneSyndicatePerAccount(false));
    }
  };

  const connectedWalletIconStyles = "fill-current text-green-500";

  const NotConnectedButton = () => (
    <button
      onClick={connectWallet}
      className={`bg-white bg-opacity-5 border border-gray-500 border-opacity-30 flex relative rounded-full px-4 py-1 items-center`}
    >
      <img
        src={"/images/walletDisconnected.svg"}
        className={`w-5 h-4 pr-1 m-2 ${connectedWalletIconStyles}`}
        alt="wallet-icon"
      />
      <span className="focus:outline-none mr-1 text-sm font-whyte-regular">
        Connect Wallet
      </span>
      <div className="flex items-center ml-2">
        <img src="/images/chevron-down.svg" alt="down-arrow" />
      </div>
    </button>
  );

  return (
    <div className="flex justify-between rounded-full bg-gray-shark bg-opacity-50 items-center">
      <>
        {/* hide wallet on signin page */}
          <div className="wallet-connect flex relative justify-center my-1 mr-1">
            {status === "connected" ? (
              <AddressMenuDropDown web3={web3} />
            ) : (
              <NotConnectedButton />
            )}
            <Joyride
              steps={steps}
              run={oneSyndicatePerAccount}
              tooltipComponent={Tooltip}
              floaterProps={{ hideArrow: true, disableAnimation: true }}
              callback={handleClose}
            />
          </div>
      </>
    </div>
  );
};

export default Wallet;
