import { showWalletModal } from "@/redux/actions/web3Provider";
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";

export const Wallet = (props) => {
  /**
   * This web3 is coming from the provider that is connected using the
   * hook useWeb3React() from @web3-react library.
   * The instance is in the application's store and is passed here as props
   */
  const { web3, dispatch } = props;
  const { status, account } = web3;

  /**
   * wallet icon for when wallet is connected and when not connected
   */
  const walletIcon =
    status === "connected"
      ? "/images/walletConnected.svg"
      : "/images/walletDisconnected.svg";

  /**
   * open variable is used to determine whether to show or hide
   *  the wallet connection modal.
   */
  const connectWallet = () => dispatch(showWalletModal());

  // format the account in the format 0x123...3435
  const formatAddress = (account: string) => {
    return `${account.slice(0, 5)}...${account.slice(
      account.length - 4,
      account.length
    )}`;
  };

  return (
    <div className="flex bg-gray-dark rounded-full my-1 px-4 py-2 items-center">
      <img src={walletIcon} className="w-5 h-4 pr-1 m-2" />

      <button
        onClick={connectWallet}
        className="focus:outline-none mr-1 text-sm">
        {account ? formatAddress(account) : "Not connected"}
      </button>
    </div>
  );
};

/**
 * Retrieve the web3 object from web3Reducer and return it as props
 * @param {*} state
 */
const mapStateToProps = ({ web3Reducer: { web3 } }) => {
  return {
    web3,
  };
};

Wallet.propTypes = {
  web3: PropTypes.object.isRequired,
  dispatch: PropTypes.any,
};

export default connect(mapStateToProps)(Wallet);
