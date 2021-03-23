import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { showWalletModal } from "src/redux/actions/web3Provider";
import ConnectWallet from "src/components/connectWallet";

// icons

import walletConnectedIcon from "src/images/walletConnected.png";
import walletDisConnectedIcon from "src/images/walletDisconnected.png";

export const Wallet = (props) => {
  /**
   * This web3 is coming from the provider that is connected using the
   * hook useWeb3React() from @web3-react library.
   * The instance is in the application's store and is passed here as props
   */
  const { web3, dispatch } = props;
  const { status } = web3;

  /**
   * wallet icon for when wallet is connected and when not connected
   */
  const walletIcon =
    status === "connected" ? walletConnectedIcon : walletDisConnectedIcon;

  /**
   * open variable is used to determine whether to show or hide
   *  the wallet connection modal.
   */
  const connectWallet = () => dispatch(showWalletModal());

  /**
   * Address variable is shown on the navigation bar when user
   *  wallet account is connected
   */
  const [address, setAddress] = useState(null);
  console.log({ web3 });

  useEffect(() => {
    /**
     * if we have library set, we retrieve the wallet account,
     *  format it and save it to address variable. This address is shown on the
     *  navigation bar
     */
    if (web3.account) {
      // get the wallet account
      const account = web3?.account;

      // format the account in the format 0x123...3435
      const formattedAddress = `${account.slice(0, 5)}...${account.slice(
        account.length - 4,
        account.length
      )}`;

      // save the formatted address to address state variable
      setAddress(formattedAddress);
    } else {
      // library is null when disconnected so we need to set address to null
      setAddress(null);
    }
  }, [web3]);

  return (
    <div className="flex flex-row bg-gray-dark rounded-full my-1 px-4">
      <img src={walletIcon} className="w-5 h-4 pr-1 mt-3 mr-2" />

      <button onClick={connectWallet} className="focus:outline-none">
        {address ? address : "Not connected"}
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
};

export default connect(mapStateToProps)(Wallet);
