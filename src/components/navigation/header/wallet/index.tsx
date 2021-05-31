import { showWalletModal } from "@/redux/actions/web3Provider";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { connect, useSelector } from "react-redux";
import Joyride from "react-joyride";
import { RootState } from "src/redux/store";
import { setOneSyndicatePerAccount } from "@/redux/actions/syndicateLPDetails";
import { oneSyndicatePerAccountText } from "@/components/syndicates/shared/Constants";

export const Wallet = (props) => {
  /**
   * This web3 is coming from the provider that is connected using the
   * hook useWeb3React() from @web3-react library.
   * The instance is in the application's store and is passed here as props
   */
  const { web3, dispatch } = props;
  const { status, account } = web3;

  const { oneSyndicatePerAccount } = useSelector(
    (state: RootState) => state.syndicateLPDetailsReducer
  );
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
  const connectWallet = () => {
    dispatch(setOneSyndicatePerAccount(false));
    dispatch(showWalletModal());
  };

  // format the account in the format 0x123...3435
  const formatAddress = (account: string) => {
    return `${account.slice(0, 5)}...${account.slice(
      account.length - 4,
      account.length
    )}`;
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

  return (
    <div className="wallet-connect flex relative justify-center">
      <div
        onClick={connectWallet}
        className="flex relative bg-gray-dark rounded-full my-1 px-4 py-2 items-center"
      >
        <img src={walletIcon} className="w-5 h-4 pr-1 m-2" />

        <button className="focus:outline-none mr-1 text-sm font-whyte-regular">
          {account ? formatAddress(account) : "Not connected"}
        </button>
        <div className="flex items-center ml-2">
          <img src="/images/chevron-down.svg" alt="down-arrow" />
        </div>
      </div>
      <Joyride
        steps={steps}
        run={oneSyndicatePerAccount}
        tooltipComponent={Tooltip}
        floaterProps={{ hideArrow: true, disableAnimation: true }}
        callback={handleClose}
      />
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
