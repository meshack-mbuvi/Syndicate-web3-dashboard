import React from "react";
import ConnectWalletModal from "src/components/modal";

// icons
import metamaskIcon from "src/images/metamask.png";
import gnosisSafeIcon from "src/images/gnosisSafe.png";
import walletConnectIcon from "src/images/walletConnect.png";

/**
 * This component renders a modal with:
 * 1. Metamask button
 * 2. Gnosis
 * 3. Wallet Connet
 */
export const ConnectWallet = () => {
  return (
    <div>
      <ConnectWalletModal title="Connect Crypto Wallet">
        {/* Metamask button */}
        <div className="flex justify-center m-auto mb-4">
          <button className="border rounded-full py-3 px-6 p-2 w-3/4 flex focus:outline-none focus:border-blue-300">
            <img
              alt="icon"
              src={metamaskIcon}
              className="inline w-8 h-7 mr-4 ml-2"
            />
            <span>Metamask</span>
          </button>
        </div>

        {/* Gnosis button */}
        <div className="flex justify-center m-auto mb-4">
          <button className="border rounded-full py-3 px-6 p-2 w-3/4 flex focus:outline-none focus:border-blue-300">
            <img
              alt="icon"
              src={gnosisSafeIcon}
              className="inline w-8 h-8 mr-4 ml-2"
            />
            <span>Gnosis Safe</span>
          </button>
        </div>

        {/* wallet Connect button */}
        <div className="flex justify-center m-auto mb-4">
          <button className="border rounded-full py-3 px-6 p-2 w-3/4 flex focus:outline-none focus:border-blue-300">
            <img
              alt="icon"
              src={walletConnectIcon}
              className="inline w-8 h-5 mr-4 ml-2"
            />
            <span>Wallet connect</span>
          </button>
        </div>
      </ConnectWalletModal>
    </div>
  );
};

export default ConnectWallet;
