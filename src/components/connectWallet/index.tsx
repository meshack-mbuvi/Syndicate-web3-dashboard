import { BanIcon, CancelIcon } from "@/components/shared/Icons";
import WalletConnectDemoButton, {
  DemoButtonType,
} from "@/containers/layoutWithSyndicateDetails/demo/buttons/WalletConnectDemoButton";
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
import { ConnectModal, ConnectModalStyle } from "./connectModal";

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
  const [walletConnectingHelperText, setWalletConnectingHelperText] =
    useState<string>("");
  const [showHelpLink, setShowHelpLink] = useState<boolean>(false);
  const [helpLink, setHelpLink] = useState<string>("#");

  // set the correct text for the loading modal
  // After 10 seconds, we switch the wallet connect message, showing a help link.
  useEffect(() => {
    if (providerName) {
      const name = providerName === "Injected" ? "Metamask" : providerName;
      if (name === "Metamask") {
        setWalletConnectingText(`Unlock wallet`);
        setWalletConnectingHelperText(`You may need to click the extension`);
      } else {
        setWalletConnectingText(
          `Sign in using the ${name} pop-up to continue.`,
        );
        const timeoutId = setTimeout(() => {
          setWalletConnectingText(`Waiting for ${name}...`);

          // set help link based on provider
          // These links should be updated once we have our own help center
          if (providerName === "Injected") {
            setHelpLink("https://metamask.zendesk.com/hc/en-us");
            setShowHelpLink(false);
          } else if (providerName === "WalletConnect") {
            setHelpLink("https://walletconnect.org/support");
            setShowHelpLink(true);
          }
        }, 10000);
        return () => clearTimeout(timeoutId);
      }
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
    {
      name: "Coinbase Wallet",
      icon: "/images/coinbase-wallet.svg",
      providerToActivate: () => activateInjected(),
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
    if (!hidden) {
      return (
        <div className="flex justify-center items-center m-auto">
          <button
            className={`w-full py-4.5 px-6 rounded-custom flex items-center justify-between focus:outline-none focus:border-gray-3 focus:border-1 bg-gradient-to-r bg-gray-syn7 hover:bg-gray-syn6`}
            onClick={() => providerToActivate()}
          >
            <span className="text-white text-sm sm:text-base">{name}</span>
            <img
              alt="icon"
              src={icon}
              className="inline mw-6 sm:w-10 max-h-7"
            />
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
    providerIcon = "/images/wallet.svg"; // could be Metamask or Coinbase Wallet
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
          modalStyle: ConnectModalStyle.BARE,
        }}
      >
        <>
          <div className="rounded-2xl bg-gray-syn8 px-4.5 pt-6">
            {/* Titles */}
            <h4 className="text-white text-sm uppercase font-bold tracking-wide">
              Connect a wallet
            </h4>
            <p className="text-xs text-gray-syn5 mb-6 mt-2">
              <span>
                By connecting your wallet, you agree to Syndicate&apos;s&nbsp;
                <a
                  href="https://www.notion.so/syndicateprotocol/Syndicate-Terms-of-Service-04674deec934472e88261e861cdcbc7c"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Terms
                </a>
                ,{" "}
                <a
                  href="https://docs.google.com/document/d/1yATB2hQHjCHKaUvBIzEaO65Xa0xHq-nLOEEJlJngg90/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Privacy Policy
                </a>
                , and{" "}
                <a
                  href="https://docs.google.com/document/d/1yATB2hQHjCHKaUvBIzEaO65Xa0xHq-nLOEEJlJngg90/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Community Standards
                </a>
              </span>
            </p>

            {/* Connect wallet */}
            {/* show wallet providers */}
            <div className="space-y-4 my-6">
              {providers.map((provider, i) => (
                <ProviderButton {...provider} key={i} />
              ))}
            </div>

            <div className="flex items-center justify-center space-x-2 pb-6">
              <p className="text-sm text-center">New to crypto?</p>
              <button
                className="text-sm text-blue hover:underline cursor-pointer"
                onClick={() =>
                  openExternalLink(
                    "https://en.wikipedia.org/wiki/Cryptocurrency_wallet",
                  )
                }
              >
                Learn more about wallets
              </button>
            </div>
          </div>

          {/* Demo mode */}
          <WalletConnectDemoButton
            buttonText="Try demo mode"
            alignment="justify-between"
            buttonType={DemoButtonType.ROUND}
            extraClasses="mt-4 block"
          />
        </>
      </ConnectModal>

      {/* Loading modal */}
      <ConnectModal
        show={walletConnecting}
        closeModal={cancelWalletConnection}
        height="h-80"
      >
        <div>
          <div className="relative">
            <div className="border-4 border-gray-syn7 animate-grow-shrink rounded-full mx-auto p-6 w-28 h-28"></div>
            <img
              src={providerIcon}
              className="absolute w-12 top-1/2 left-1/2"
              style={{ transform: "translate(-50%, -50%)" }}
              alt="Provider Icon"
            />
          </div>

          <p className="mx-5 mt-9 text-sm uppercase font-bold tracking-wide text-center">
            {walletConnectingText}
          </p>
          <p className="mx-5 text-sm text-gray-syn4 text-center mt-3">
            {walletConnectingHelperText}
          </p>
          {showHelpLink ? (
            <div className="w-full flex justify-center">
              <button
                className="mt-4 mb-4 text-sm text-blue hover:underline text-center w-fit-content cursor-pointer"
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
        <div className="mt-14">
          <div className="relative">
            <div className="border-4 border-green-light rounded-full mx-auto p-6 w-28 h-28"></div>
            <img
              src={providerIcon}
              className="absolute w-12 top-1/2 left-1/2"
              style={{ transform: "translate(-50%, -50%)" }}
              alt="Provider Icon"
            />
          </div>

          <p className="mx-5 mt-9 text-sm uppercase font-bold tracking-wide text-center">
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
            className="primary-CTA flex cursor-pointer justify-center items-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue w-full"
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
