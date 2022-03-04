import { BanIcon, CancelIcon } from "@/components/shared/Icons";
import WalletConnectDemoButton from "@/containers/layoutWithSyndicateDetails/demo/buttons/WalletConnectDemoButton";
// set up smart contract and pass it as context
// actions
import { useConnectWalletContext } from "@/context/ConnectWalletProvider";
import { AppState } from "@/state";
import {
  hideErrorModal,
  hideWalletModal,
  setDispatchCreateFlow,
} from "@/state/wallet/actions";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { SpinnerWithImage } from "../shared/spinner/spinnerWithImage";
import { ConnectModal } from "./connectModal";

/**
 * The component shows a modal with buttons to connect to different
 * wallets namely: metamask and walletConnect.
 *
 * NOTE: Gnosis safe has been disabled but will be enabled in future when needed.
 * Reference ticket: SYN-49 Gnosis Wallet Integration
 *
 * The component also connects to the provider selected by the user.
 * Once wallet is connected, an action to update library is emitted.
 */
const ConnectWallet: React.FC = () => {
  const dispatch = useDispatch();

  const {
    web3Reducer: {
      web3: {
        isErrorModalOpen,
        error,
        account,
        ethereumNetwork: { correctEthereumNetwork, invalidEthereumNetwork },
      },
      showWalletModal,
      dispatchCreateFlow,
    },
  } = useSelector((state: AppState) => state);

  const {
    connectWallet,
    showSuccessModal,
    walletConnecting,
    setShowSuccessModal,
    providerName,
    cancelWalletConnection,
    loadedAsSafeApp,
  } = useConnectWalletContext();

  //loader text
  const [walletConnectingText, setWalletConnectingText] = useState<string>("");
  const [showHelpLink, setShowHelpLink] = useState<boolean>(false);
  const [helpLink, setHelpLink] = useState<string>("#");

  // set the correct text for the loading modal
  // After 10 seconds, we switch the wallet connect message, showing a help link.
  useEffect(() => {
    if (providerName) {
      const name = providerName === "Injected" ? "Metamask" : providerName;
      setWalletConnectingText(`Sign in using the ${name} pop-up to continue.`);
      const timeoutId = setTimeout(() => {
        setWalletConnectingText(`Waiting for ${name}...`);

        // set help link based on provider
        // These links should be updated once we have our own help center
        if (providerName === "Injected") {
          setHelpLink("https://metamask.zendesk.com/hc/en-us");
        } else if (providerName === "WalletConnect") {
          setHelpLink("https://walletconnect.org/support");
        }
        setShowHelpLink(true);
      }, 10000);
      return () => clearTimeout(timeoutId);
    }
  }, [providerName]);

  // This handles closing the modal after user selects a provider to activate
  const closeWalletModal = () => {
    dispatch(hideWalletModal());
    if (dispatchCreateFlow) {
      dispatch(setDispatchCreateFlow(false));
    }
  };

  // activate method handles connection to any wallet account while library will
  // contain the web3 provider selected

  // The providers supported are listed in here with their custom details
  const providers = [
    {
      name: "Metamask",
      icon: "/images/metamaskIcon.svg",
      providerToActivate: () => activateInjected(),
      hidden: loadedAsSafeApp,
    },
    {
      name: "Gnosis Safe",
      icon: "/images/gnosisSafe.png",
      providerToActivate: () => activateGnosisSafe(),
      hidden: !loadedAsSafeApp,
    },
    {
      name: "Wallet Connect",
      icon: "/images/walletConnect.svg",
      providerToActivate: () => activateWalletConnect(),
      hidden: loadedAsSafeApp,
    },
  ];

  /**
   * This function is triggered when user clicks metamask button
   * The provider for metamask is named injected
   */
  const activateInjected = async () => {
    connectWallet("Injected");
  };

  /**
   * This method is triggered when user clicks wallet connect button.
   * It calls activateProvider passing WalletConnect as the parameters.
   */
  const activateWalletConnect = async () => {
    connectWallet("WalletConnect");
  };

  /**
   * This method is triggered when user clicks Gnosis Safe connect button.
   * It calls activateProvider passing gnosisSafeConnect as the parameters.
   *
   * Ticket reference: SYN-49
   */
  const activateGnosisSafe = async () => {
    connectWallet("GnosisSafe");
  };

  // showConnectWalletModal

  // button for each provider
  const ProviderButton = ({ name, icon, providerToActivate, hidden }) => {
    let gradientColor;
    switch (name) {
      case "Gnosis Safe":
        gradientColor = "to-green-light-darker from-green-light-dark ";
        break;
      case "Wallet Connect":
        gradientColor = "from-blue-light-dark to-blue-light-darker";
        break;
      default:
        gradientColor = "from-orange-dark to-orange-light";
    }
    if (!hidden) {
      return (
        <div className="flex justify-center items-center m-auto mb-3">
          <button
            className={`w-full p-4 rounded-lg flex items-center justify-between border border-gray-blackRussian hover:border-gray-3 focus:outline-none focus:border-gray-3 focus:border-1 bg-gradient-to-r ${gradientColor} `}
            onClick={() => providerToActivate()}
          >
            <span className="text-white text-sm sm:text-base">{name}</span>
            <img alt="icon" src={icon} className="inline mw-6 sm:w-10" />
          </button>
        </div>
      );
    }
    return null;
  };

  let errorButtonText, errorIcon;
  const metamaskNotInstalledError =
    error && error.type === "NoEthereumProviderError";
  if (metamaskNotInstalledError) {
    errorButtonText = "Go to Metamask’s website";
    errorIcon = (
      <img
        src="/images/metamaskIcon.svg"
        alt="metamaskIcon"
        className="inline w-8 sm:w-16"
      ></img>
    );
  } else {
    errorButtonText = "Close";
    errorIcon = <CancelIcon height="h-12" width="w-12" />;
  }

  // function to handle error CTA button being clicked
  const handleErrorButtonAction = () => {
    if (metamaskNotInstalledError) {
      window.open("https://metamask.io/");
    } else {
      dispatch(hideErrorModal());
    }
  };

  // provider icon to display on loading state modals
  let providerIcon;
  if (providerName === "Injected") {
    providerIcon = "/images/metamaskIcon.svg";
  } else if (providerName === "WalletConnect") {
    providerIcon = "/images/walletConnect.svg";
  } else if (providerName === "GnosisSafe") {
    providerIcon = "/images/gnosisSafe.png";
  }

  // open external help links
  const openExternalLink = (link: string) => {
    window.open(link, "_blank", "noopener");
  };

  return (
    <div>
      <ConnectModal
        {...{
          show: showWalletModal,
          closeModal: closeWalletModal,
          title: "Connect crypto wallet",
          subtext: (
            <span>
              By connecting your wallet, you agree to our&nbsp;
              <a
                href="https://www.notion.so/syndicateprotocol/Syndicate-Terms-of-Service-04674deec934472e88261e861cdcbc7c"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms of Service
              </a>
              &nbsp;and&nbsp;
              <a
                href="https://docs.google.com/document/d/1yATB2hQHjCHKaUvBIzEaO65Xa0xHq-nLOEEJlJngg90/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>
            </span>
          ),
        }}
      >
        <>
          {/* show wallet providers */}
          {providers.map((provider, i) => (
            <ProviderButton {...provider} key={i} />
          ))}

          <p className="mt-5 text-sm text-center">New to Ethereum?</p>
          <div className="w-full flex justify-center">
            <button
              className="mt-2 mb-4 text-sm text-blue hover:underline text-center w-fit-content cursor-pointer"
              onClick={() =>
                openExternalLink(
                  "https://en.wikipedia.org/wiki/Cryptocurrency_wallet",
                )
              }
            >
              Learn more about crypto wallets
            </button>
          </div>
          <div className="pt-12 pb-4">
            <WalletConnectDemoButton
              buttonText="Try demo mode"
              alignment="justify-between"
            />
          </div>
        </>
      </ConnectModal>

      {/* Loading modal */}
      <ConnectModal
        show={walletConnecting}
        closeModal={cancelWalletConnection}
        height="h-80"
      >
        <div>
          <div className="mb-4">
            <SpinnerWithImage icon={providerIcon} />
          </div>

          <p className="mx-5 text-lg font-whyte-light text-center">
            {walletConnectingText}
          </p>
          {showHelpLink ? (
            <div className="w-full flex justify-center">
              <button
                className="mt-4 mb-4 text-base text-blue hover:underline text-center w-fit-content cursor-pointer"
                onClick={() => openExternalLink(helpLink)}
              >
                Help
              </button>
            </div>
          ) : null}
        </div>
      </ConnectModal>

      {/* success modal */}
      <ConnectModal
        show={showSuccessModal && !walletConnecting}
        showCloseButton={false}
        height="h-80"
        closeModal={() => setShowSuccessModal(false)}
      >
        <div className="flex flex-col items-center justify-center h-full">
          <div className="rounded-full h-28 w-28 border-4 border-green-light flex items-center justify-center">
            <img
              src={providerIcon}
              className="inline w-6 sm:w-10"
              alt="provider-icon"
            />
          </div>

          <p className="mx-5 mt-4 text-sm sm:text-lg font-whyte-light text-center">
            Connected
          </p>
        </div>
      </ConnectModal>

      {/* wrong network modal */}
      {invalidEthereumNetwork && !walletConnecting && account && (
        <ConnectModal
          show={invalidEthereumNetwork}
          closeModal={closeWalletModal}
          showCloseButton={false}
          type="error"
        >
          <div className="flex flex-col justify-center m-auto">
            <div className="flex align-center justify-center">
              <div className="h-20 w-20 pb-8 pt-10 flex items-center justify-center">
                <BanIcon />
              </div>
            </div>
            <div className="modal-header mb-4 font-medium text-center">
              <div className="mx-6">
                <p className="text-lg mb-2">
                  Not connected to {correctEthereumNetwork}
                </p>
                <p className="text-sm font-whyte-light">
                  Your wallet is connected to a different network. Please switch
                  to {correctEthereumNetwork} to continue.
                </p>
                <div className="w-full flex justify-center">
                  <button
                    className="my-6 text-base text-blue font-whyte-light hover:underline text-center w-fit-content cursor-pointer"
                    onClick={() =>
                      openExternalLink("https://metamask.zendesk.com/hc/en-us")
                    }
                  >
                    Show me how
                  </button>
                </div>
              </div>
              <button
                type="button"
                className="flex justify-center items-center px-6 py-3 text-base font-medium rounded-lg bg-gray-dark w-full"
              >
                <SpinnerWithImage
                  icon={null}
                  height="h-8"
                  width="w-8"
                  strokeWidth="10"
                />
              </button>
            </div>
          </div>
        </ConnectModal>
      )}

      {/* Error modal  */}
      <ConnectModal
        show={isErrorModalOpen}
        showCloseButton={!!metamaskNotInstalledError}
        height={error?.type === "web3InstantionError" ? "h-auto" : "h-72"}
        closeModal={() => dispatch(hideErrorModal())}
        type="error"
      >
        <div className="flex flex-col justify-between m-auto">
          <div className="flex align-center justify-center">
            <div className="h-20 w-20 pb-4 flex items-center justify-center">
              {errorIcon}
            </div>
          </div>
          <div className="mx-6 text-center">
            {!!error?.title && <p className="text-lg mb-2">{error.title}</p>}
            <p className="text-base font-whyte-light mx-4 sm:mx-6 mb-6">
              {error?.message}
            </p>
          </div>
          <button
            type="button"
            className="flex cursor-pointer justify-center font-whyte-light items-center px-6 py-3 text-sm text-black font-medium rounded-lg bg-white hover:bg-gray-3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue w-full"
            onClick={handleErrorButtonAction}
          >
            {errorButtonText}
          </button>
        </div>
      </ConnectModal>
    </div>
  );
};

export default ConnectWallet;
