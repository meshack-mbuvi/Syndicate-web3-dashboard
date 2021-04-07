import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import ConnectWallet from "src/components/connectWallet";
import { showWalletModal } from "src/redux/actions/web3Provider";

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
      ? "/images/walletConnected.png"
      : "/images/walletDisconnected.png";

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
    <div className="flex flex-row bg-gray-dark rounded-full my-1 px-2 h-8">
      <img src={walletIcon} className="w-5 h-4 pr-1 mt-2 mr-2" />

      <button onClick={connectWallet} className="focus:outline-none mr-1">
        {account ? formatAddress(account) : "Not connected"}
      </button>

      <ConnectWallet />
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
