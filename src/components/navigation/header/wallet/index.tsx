import { showWalletModal } from "@/state/wallet/actions";
import { Status } from "@/state/wallet/types";
import { formatAddress } from "@/utils/formatAddress";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "@/state";
import AddressMenuDropDown from "./accountMenuDropdown";
import React from "react";
import { useDemoMode } from "@/hooks/useDemoMode";

export const Wallet: React.FC = () => {
  /**
   * This web3 is coming from the provider that is connected using the
   * hook web3modal.
   * The instance is in the application's store and is passed here as props
   */
  const {
    web3Reducer: { web3 },
  } = useSelector((state: AppState) => state);

  const { status } = web3;
  const dispatch = useDispatch();

  const isDemoMode = useDemoMode();

  /**
   * open variable is used to determine whether to show or hide
   *  the wallet connection modal.
   */
  const connectWallet = () => {
    dispatch(showWalletModal());
  };

  const connectedWalletIconStyles = "fill-current text-green-500";

  const NotConnectedButton = () => (
    <button
      onClick={connectWallet}
      className={`bg-white bg-opacity-5 border border-gray-500 border-opacity-30 flex relative rounded-full px-4 py-1 items-center h-11 sm:h-9`}
    >
      <img
        src={"/images/walletDisconnected.svg"}
        className={`w-3 h-2.5 mr-3 ${connectedWalletIconStyles}`}
        alt="wallet-icon"
      />
      <span className="focus:outline-none ml-1 sm:ml-0 mr-3 sm:mr-1 text-base leading-5.5 sm:py-0 sm:text-sm font-whyte-regular sm:leading-4">
        Connect Wallet
      </span>
      <div className="flex items-center ml-2">
        <img src="/images/chevron-down.svg" alt="down-arrow" />
      </div>
    </button>
  );

  const formattedDemoAddress = formatAddress(
    "0x2502947319f2166eF46f0a7c081D23C63f88112B",
    7,
    6,
  );

  const DemoConnectButton = () => (
    <div
      className={`bg-green-volt bg-opacity-5 border border-green-volt border-opacity-30 flex relative rounded-full px-4 py-1 items-center h-11 sm:h-9`}
    >
      <img
        src={"/images/status/gamecontroller.svg"}
        width="16.56"
        alt="demo icon"
        className="mr-2"
      />
      <span className="focus:outline-none ml-1 sm:ml-0 mr-3 sm:mr-1 text-base leading-5.5 sm:text-sm font-whyte-regular">
        <span className="text-gray-syn4">
          {formattedDemoAddress.slice(0, 2)}
        </span>
        {formattedDemoAddress.slice(2)}
      </span>
      <div className="flex items-center ml-2">
        <img src="/images/chevron-down.svg" alt="down-arrow" />
      </div>
    </div>
  );

  if (isDemoMode) {
    return <DemoConnectButton />;
  }

  return (
    <div className="flex justify-between py-7 w-full sm:py-0 rounded-full sm:bg-gray-shark sm:bg-opacity-50 items-center">
      <>
        {/* hide wallet on signin page */}
        <div className="wallet-connect w-full flex justify-center">
          {status === Status.CONNECTED ? (
            <AddressMenuDropDown web3={web3} />
          ) : (
            <NotConnectedButton />
          )}
        </div>
      </>
    </div>
  );
};

export default Wallet;
