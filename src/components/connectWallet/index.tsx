// set up smart contract and pass it as context
// actions
import {
  hideErrorModal,
  hideWalletModal,
  setConnected,
  setConnecting,
  setDisConnected,
  setLibrary,
  showErrorModal,
} from "@/redux/actions/web3Provider";
import { Contract } from "@ethersproject/contracts";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import { UserRejectedRequestError as UserRejectedRequestErrorFrame } from "@web3-react/frame-connector";
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from "@web3-react/injected-connector";
import { UserRejectedRequestError as UserRejectedRequestErrorWalletConnect } from "@web3-react/walletconnect-connector";
import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import CancelButton from "src/components/buttons";
import { Modal } from "src/components/modal";
import Syndicate from "src/contracts/Syndicate.json";
import { injected, WalletConnect } from "./connectors";

const Web3 = require("web3");

const contractAddress = process.env.NEXT_PUBLIC_SYNDICATE_CONTRACT_ADDRESS;

const daiABI = require("src/utils/abi/dai");
const daiContractAddress = "0x6b175474e89094c44da98b954eedeac495271d0f";

/**
 * This method examines a given error to find its type and then returns a
 * custom error message depending on the type of error
 * @param error
 * @returns {string} message indicating the type of error that occured
 */
const getErrorMessage = (error: Error) => {
  if (error instanceof NoEthereumProviderError) {
    return "No Ethereum browser extension detected, install MetaMask on desktop using this link https://metamask.io/ or visit from a dApp browser on mobile.";
  } else if (error instanceof UnsupportedChainIdError) {
    return "You're connected to an unsupported network. Ensure you are connected to either Mainnet, Ropsten, Kovan, Rinkeby or Goerli";
  } else if (
    error instanceof UserRejectedRequestErrorInjected ||
    error instanceof UserRejectedRequestErrorWalletConnect ||
    error instanceof UserRejectedRequestErrorFrame
  ) {
    return "Please authorize this website to access your Ethereum account.";
  } else {
    console.error(error);
    return "An unknown error occurred. Check the console for more details.";
  }
};

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
export const ConnectWallet = (props: { web3; showWalletModal }) => {
  const {
    web3: { isErrorModalOpen, error },
    showWalletModal,
  } = props;

  const dispatch = useDispatch();

  // This handles closing the modal after user selects a provider to activate
  const closeWalletModal = () => {
    dispatch(hideWalletModal());
  };

  // control whether to show success connection modal or not
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [walletConnecting, setWalletConnecting] = useState(false);

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
      dispatch(setConnecting());

      /**SyndicateABI.networks["5777"].address;
       * The address is coming from the tests.
       * const daiContractAddress = "0x6b175474e89094c44da98b954eedeac495271d0f
       * get address from truffle =>0x15333C7B5eddB2c08A0931645C591a575eDeAde7
       */
      const contract = new Contract(
        contractAddress,
        Syndicate.abi,
        library.getSigner()
      );

      /**
       * set up web3 event listener here
       * we can use to get access to all events emitted by the contract
       *
       */
      const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
      const web3contractInstance = new web3.eth.Contract(
        Syndicate.abi,
        contractAddress
      );

      // set up DAI contract
      const daiContract = new web3.eth.Contract(daiABI, daiContractAddress);

      try {
        syndicateInstance = await contract.deployed();
        dispatch(hideErrorModal());
        return dispatch(
          setLibrary({
            library,
            account,
            syndicateInstance,
            web3contractInstance,
            daiContract,
            web3,
          })
        );
      } catch (error) {
        console.log({ error });
        console.log({
          message:
            "web3 instance not instantiated correctly. This could be an issue with the deployed contract",
        });
        dispatch(setDisConnected());
        dispatch(
          showErrorModal(
            "web3 instance not instantiated correctly. This could be an issue with the deployed contract"
          )
        );
      }
    }
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

    setWalletConnecting(true);
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
      setWalletConnecting(false);

      // show success modal
      setShowSuccessModal(true);
      await setWeb3();
    } catch (error) {
      // an error occured during connection process

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
      dispatch(setConnected());

      const customError = getErrorMessage(error);
      dispatch(showErrorModal(customError));
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
      <Modal
        {...{ show: walletConnecting, closeModal: cancelWalletConnection }}>
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
        }}>
        <div className="flex flex-col justify-center m-auto mb-4">
          <div className="flex align-center justify-center">
            <div className="m-8 rounded-full h-24 w-24 flex items-center justify-center">
              <img src="/images/checkCircle.svg" />
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

      {/* error modal */}
      <Modal
        {...{
          show: isErrorModalOpen,
          closeModal: () => dispatch(hideErrorModal()),
          type: "error",
        }}>
        <div className="flex flex-col justify-center m-auto mb-4">
          <div className="flex align-center justify-center">
            <div className="border-4 border-light-blue m-8 rounded-full h-24 w-24 flex items-center justify-center">
              <svg
                height="365pt"
                viewBox="0 0 365.71733 365"
                width="365pt"
                xmlns="http://www.w3.org/2000/svg"
                className="h-10">
                <g fill="#f44336">
                  <path d="m356.339844 296.347656-286.613282-286.613281c-12.5-12.5-32.765624-12.5-45.246093 0l-15.105469 15.082031c-12.5 12.503906-12.5 32.769532 0 45.25l286.613281 286.613282c12.503907 12.5 32.769531 12.5 45.25 0l15.082031-15.082032c12.523438-12.480468 12.523438-32.75.019532-45.25zm0 0" />
                  <path d="m295.988281 9.734375-286.613281 286.613281c-12.5 12.5-12.5 32.769532 0 45.25l15.082031 15.082032c12.503907 12.5 32.769531 12.5 45.25 0l286.632813-286.59375c12.503906-12.5 12.503906-32.765626 0-45.246094l-15.082032-15.082032c-12.5-12.523437-32.765624-12.523437-45.269531-.023437zm0 0" />
                </g>
              </svg>
            </div>
          </div>
          <div className="modal-header mb-4 text-black font-medium text-center ">
            <p className="text-2xl">{error}</p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const mapStateToProps = ({ web3Reducer }) => {
  const { web3, showWalletModal, isErrorModalOpen } = web3Reducer;
  return { web3, showWalletModal, isErrorModalOpen };
};

export default connect(mapStateToProps)(ConnectWallet);
