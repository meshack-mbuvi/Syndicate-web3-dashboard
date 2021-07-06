// set up smart contract and pass it as context
// actions
import { useConnectWalletContext } from "@/context/ConnectWalletProvider";
import { hideErrorModal, hideWalletModal } from "@/redux/actions/web3Provider";
import React from "react";
import { connect, useDispatch } from "react-redux";
import CancelButton from "src/components/buttons";
import { Modal } from "src/components/modal";
import { Spinner } from "../shared/spinner";

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

  const {
    connectWallet,
    showSuccessModal,
    walletConnecting,
    setShowSuccessModal,
    cancelWalletConnection,
  } = useConnectWalletContext();

  // This handles closing the modal after user selects a provider to activate
  const closeWalletModal = () => {
    dispatch(hideWalletModal());
  };

  // activate method handles connection to any wallet account while library will
  // contain the web3 provider selected

  // The providers supported are listed in here with their custom details
  const providers = [
    {
      name: "Metamask",
      icon: "/images/metamaskIcon.svg",
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
      icon: "/images/walletConnect.svg",
      providerToActivate: () => activateWalletConnect(),
    },
  ];

  /**
   * This function is triggered when user clicks metamask button
   * The provider for metamask is named injected
   */
  const activateInjected = async () => {
    await connectWallet("Injected");
  };

  /**
   * This method is triggered when user clicks wallet connect button.
   * It calls activateProvider passing WalletConnect as the parameters.
   */
  const activateWalletConnect = async () => {
    await connectWallet("WalletConnect");
  };

  /**
   * This method is triggered when user clicks Gnosis Safe connect button.
   * It calls activateProvider passing gnosisSafeConnect as the parameters.
   *
   * Ticket reference: SYN-49
   */
  // const activateGnosisSafe = async () => {
  //   await activateProvider(gnosisSafeConnect,"gnosisSafeConnect");
  // };

  // showConnectWalletModal
  return (
    <div>
      <Modal
        title="Connect Crypto Wallet"
        {...{
          show: showWalletModal,
          closeModal: closeWalletModal,
          customWidth: "w-96",
        }}
      >
        <>
          {/* show wallet providers */}
          {providers.map(({ name, icon, providerToActivate }) => (
            <div className="flex justify-center m-auto mb-4" key={name}>
              <button
                className="w-full p-2 border border-gray-300 rounded-full sm:py-3 sm:px-6 sm:w-3/4 flex focus:outline-none focus:border-blue-300"
                onClick={() => providerToActivate()}
              >
                <img alt="icon" src={icon} className="inline mr-4 ml-2 h-6" />
                <span>{name}</span>
              </button>
            </div>
          ))}

          {/* Show cancel button */}
          <div className="mt-5 sm:mt-6 flex justify-center">
            <CancelButton
              customClasses="bg-blue rounded-full px-4 py-2 mb-6 sm:mb-0 focus:outline-none focus:ring focus:border-green-300"
              onClick={closeWalletModal}
            >
              Cancel
            </CancelButton>
          </div>
        </>
      </Modal>

      {/* Loading modal */}
      <Modal
        {...{ show: walletConnecting, closeModal: cancelWalletConnection }}
      >
        <div className="flex flex-col justify-center m-auto mb-4 w-96">
          <Spinner />
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
        }}
      >
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
        }}
      >
        <div className="flex flex-col justify-center m-auto mb-4">
          <div className="flex align-center justify-center">
            <div className="border-4 border-light-blue m-8 rounded-full h-24 w-24 flex items-center justify-center">
              <svg
                height="365pt"
                viewBox="0 0 365.71733 365"
                width="365pt"
                xmlns="http://www.w3.org/2000/svg"
                className="h-10"
              >
                <g fill="#f44336">
                  <path d="m356.339844 296.347656-286.613282-286.613281c-12.5-12.5-32.765624-12.5-45.246093 0l-15.105469 15.082031c-12.5 12.503906-12.5 32.769532 0 45.25l286.613281 286.613282c12.503907 12.5 32.769531 12.5 45.25 0l15.082031-15.082032c12.523438-12.480468 12.523438-32.75.019532-45.25zm0 0" />
                  <path d="m295.988281 9.734375-286.613281 286.613281c-12.5 12.5-12.5 32.769532 0 45.25l15.082031 15.082032c12.503907 12.5 32.769531 12.5 45.25 0l286.632813-286.59375c12.503906-12.5 12.503906-32.765626 0-45.246094l-15.082032-15.082032c-12.5-12.523437-32.765624-12.523437-45.269531-.023437zm0 0" />
                </g>
              </svg>
            </div>
          </div>
          <div className="modal-header mb-4 text-black font-medium text-center ">
            <p
              className="text-lg"
              dangerouslySetInnerHTML={{ __html: error }}
            ></p>
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
