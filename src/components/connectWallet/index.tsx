// set up smart contract and pass it as context
import { Contract } from "@ethersproject/contracts";
import { useWeb3React } from "@web3-react/core";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import CancelButton from "src/components/buttons";
import { Modal } from "src/components/modal";
import Syndicate from "src/contracts/Syndicate.json";
// actions
import {
  hideWalletModal,
  setConnected,
  setConnecting,
  setDisConnected,
  setLibrary,
} from "src/redux/actions/web3Provider";
import { injected, WalletConnect } from "./connectors";

/**
 * The component shows a modal with buttons to connect to different
 * wallets namely: metamask and walletConnect.
 *
 * NOTE: Gnosis safe has been disabled but will be enabled in future when needed.
 * Reference ticket: SYN-49 Gnosis Wallet Integration
 *
 * The component also connects to the provider selected by the user.
 * Once wallet is connected, an action to update library is emitted.
 * @param {*} props
 */
export const ConnectWallet = (props) => {
  const { web3, dispatch, showWalletModal } = props;
  const { status } = web3;

  // This handles closing the modal after user selects a provider to activate
  const closeWalletModal = () => {
    dispatch(hideWalletModal());
  };

  // control whether to show success connection modal or not
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // This variable controls loading animation modal
  const loading = status == "connecting" ? true : false;

  // activate method handles connection to any wallet account while library will
  // contain the web3 provider selected
  const { activate, library, deactivate, account } = useWeb3React();

  // The providers supported are listed in here with their custom details
  const providers = [
    {
      name: "Metamask",
      icon: "/images/metamask.png",
      providerToActivate: () => activateInjected(),
    },
    // NOTE: Gnosis safe has been disabled but will be enabled in future when needed.
    // Reference ticket: SYN-49 Gnosis Wallet Integration
    // {
    //   name: "Gnosis Safe",
    //   icon: gnosisSafeIcon,
    //   providerToActivate: () => activateGnosisSafe(),
    // },
    {
      name: "Wallet Connect",
      icon: "/images/walletConnect.png",
      providerToActivate: () => activateWalletConnect(),
    },
  ];

  /**
   * Instantiates contract, and adds it together with web3 provider details to
   * store
   */
  const setWeb3 = async () => {
    let syndicateInstance = null;
    if (library) {
      /**SyndicateABI.networks["5777"].address;
       * The address is coming from the tests.
       * const daiContractAddress = "0x6b175474e89094c44da98b954eedeac495271d0f
       * get address from truffle =>0x15333C7B5eddB2c08A0931645C591a575eDeAde7
       */
      const contract = await new Contract(
        process.env.GATSBY_SPV_CONTRACT_ADDRESS,
        Syndicate.abi,
        library.getSigner()
      );

      try {
        console.log({ contract });
        syndicateInstance = await contract.deployed();
        console.log({ syndicateInstance });
      } catch (error) {
        console.log({ error });
      }
    }

    return dispatch(setLibrary({ library, account, syndicateInstance }));
  };

  useEffect(() => {
    setWeb3();
  }, [activate, library, account]);

  /**
   * This activate any provide passed to the function where
   * provider can be injected provider, walletConnect or gnosis wallet provider
   * @param {*} provider
   */
  const activateProvider = async (provider) => {
    closeWalletModal();

    // set status to connecting; this triggers the loader
    dispatch(setConnecting());
    try {
      // Let disconnect previously connected provider first.
      if (library?.provider) {
        await deactivate();
        dispatch(setDisConnected());
      }

      // dispatch action to start loader
      await activate(provider, undefined, true);

      // provider is connected, this stops the loader modal
      dispatch(setConnected());

      // show success modal
      setShowSuccessModal(true);
    } catch (error) {
      // an error occured during connection process
      // dispatch(setDisConnected());

      /**
       * we need to find a way(designs) to show feedback to the user about
       * this error. Most of the times an error results when a user tries to
       * re-connect to the same provider which is already connected,
       * or when there is pending connection request.
       * Please check console log to find out more about this error.
       *
       * Ticket reference: SYN-52 Error states for wallet connection screen
       **/
      console.log({ error });
    }

    // close wallet connection modal
    closeWalletModal();
  };

  /**
   * This function is triggered when user clicks metamask button
   * The provider for metamask is named injected
   */
  const activateInjected = async () => {
    await activateProvider(injected);
  };

  /**
   * This method is triggered when user clicks wallet connect button.
   * It calls activateProvider passing WalletConnect as the parameters.
   */
  const activateWalletConnect = async () => {
    await activateProvider(WalletConnect);
  };

  /**
   * This method is triggered when user clicks Gnosis Safe connect button.
   * It calls activateProvider passing gnosisSafeConnect as the parameters.
   *
   * Ticket reference: SYN-49
   */
  // const activateGnosisSafe = async () => {
  //   await activateProvider(gnosisSafeConnect);
  // };

  const cancelWalletConnection = async () => {
    // set the wallet connection status to disconnected; this stops
    // the loader modal
    dispatch(setDisConnected());
  };

  // showConnectWalletModal
  return (
    <div>
      <Modal
        title="Connect Crypto Wallet"
        {...{ show: showWalletModal, closeModal: closeWalletModal }}>
        {/* show wallet providers */}
        {providers.map(({ name, icon, providerToActivate }) => (
          <div className="flex justify-center m-auto mb-4" key={name}>
            <button
              className="w-full p-2 border border-gray-300 rounded-full sm:py-3 sm:px-6 sm:w-3/4 flex focus:outline-none focus:border-blue-300"
              onClick={() => providerToActivate()}>
              <img alt="icon" src={icon} className="inline mr-4 ml-2" />
              <span>{name}</span>
            </button>
          </div>
        ))}

        {/* Show cance button */}
        <div className="mt-5 sm:mt-6 flex justify-center">
          <CancelButton
            customClasses="bg-blue-light px-4 py-2 focus:outline-none focus:ring focus:border-green-300"
            onClick={closeWalletModal}>
            Cancel
          </CancelButton>
        </div>
      </Modal>

      {/* Loading modal */}
      <Modal {...{ show: loading, closeModal: cancelWalletConnection }}>
        <div className="flex flex-col justify-center m-auto mb-4">
          <div className="loader">Loading...</div>
          <div className="modal-header mb-4 text-black font-medium text-center leading-8 text-lg">
            Connect Crypto Wallet
          </div>
        </div>
      </Modal>

      {/* success modal */}
      <Modal
        {...{
          show: showSuccessModal,
          closeModal: () => setShowSuccessModal(false),
          type: "success",
        }}>
        <div className="flex flex-col justify-center m-auto mb-4">
          <div className="flex align-center justify-center">
            <div className="border-4 border-light-blue m-8 rounded-full h-24 w-24 flex items-center justify-center">
              <svg
                width="34"
                height="26"
                viewBox="0 0 34 26"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M2 13.5723L11.2243 22.7966L32 2"
                  stroke="#35CFFF"
                  strokeWidth="4"
                />
              </svg>
            </div>
          </div>
          <div className="modal-header mb-4 text-black font-medium text-center ">
            <p className="text-3xl">Wallet Connected</p>
            <p className="leading-8 text-sm text-gray-500 m-4">
              Welcome to the Revolution
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

ConnectWallet.propTypes = {
  dispatch: PropTypes.any.isRequired,
  web3: PropTypes.object.isRequired,
  showWallet: PropTypes.bool.isRequired,
};

const mapStateToProps = ({ web3Reducer }) => {
  const { web3, showWalletModal } = web3Reducer;
  return { web3, showWalletModal };
};

export default connect(mapStateToProps)(ConnectWallet);
