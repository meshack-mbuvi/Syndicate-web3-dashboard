import { showWalletModal } from "@/state/wallet/actions";
import { Status } from "@/state/wallet/types";

import { useDispatch, useSelector } from "react-redux";
import { AppState } from "@/state";
import AddressMenuDropDown from "./accountMenuDropdown";

export const Wallet: React.FC = () => {
  /**
   * This web3 is coming from the provider that is connected using the
   * hook web3modal.
   * The instance is in the application's store and is passed here as props
   */
  const { web3 } = useSelector((state: AppState) => state.web3Reducer);

  const { status } = web3;
  const dispatch = useDispatch();

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
          <div className="wallet-connect flex relative justify-center">
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
