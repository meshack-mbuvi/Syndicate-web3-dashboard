import React, { useState, useEffect, FC } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Menu, Transition } from "@headlessui/react";
import { EtherscanLink } from "@/components/syndicates/shared/EtherscanLink";
import { formatAddress } from "@/utils/formatAddress";
import { useConnectWalletContext } from "@/context/ConnectWalletProvider";
import { WalletIcon } from "@/components/iconWrappers";
import WalletConnectDemoButton from "@/containers/layoutWithSyndicateDetails/demo/buttons/WalletConnectDemoButton";

interface IAddressMenuDropDown {
  web3: any;
}

const AddressMenuDropDown: FC<IAddressMenuDropDown> = ({ web3 }) => {
  const { disconnectWallet } = useConnectWalletContext();

  const { account, providerName, web3: web3Instance } = web3;

  const [showCopyState, setShowCopyState] = useState(false);
  const [ethBalance, setEthBalance] = useState("");

  const updateAddressCopyState = () => {
    setShowCopyState(true);
    setTimeout(() => setShowCopyState(false), 1000);
  };

  const getEthBalance = async (address: string, isMounted: boolean) => {
    try {
      const balance = await web3Instance.eth.getBalance(address);
      const ethBalance = await web3Instance.utils.fromWei(balance, "ether");
      if (isMounted) {
        setEthBalance(ethBalance);
      }
    } catch (error) {
      console.log({ error });
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (account && !ethBalance) {
      getEthBalance(account, isMounted);
    }
    return () => {
      isMounted = false;
    };
  }, [account, ethBalance]);

  const renderConnectedWith = (providerName) => {
    let currentProvider;
    let imageLink;

    switch (providerName) {
      case "Injected":
        currentProvider = "Metamask";
        imageLink = "/images/metamaskIcon.svg";
        break;
      case "WalletConnect":
        currentProvider = "WalletConnect";
        imageLink = "/images/walletConnect.svg";
        break;
      case "GnosisSafe":
        currentProvider = "Gnosis Safe";
        imageLink = "/images/gnosisSafe.png";
        break;
      default:
        currentProvider = "Metamask";
        imageLink = "/images/metamaskIcon.svg";
        break;
    }
    return (
      <>
        <p className="text-sm text-gray-300">
          Connected with {currentProvider}
        </p>
        <img alt="icon" src={imageLink} className="inline h-5" />
      </>
    );
  };

  const formattedAddress = formatAddress(account, 7, 6);

  const connectedWalletIconStyles = "fill-current text-green-500";
  return (
    <Menu as="div" className="relative">
      {({ open }) => (
        <>
          <Menu.Button className="flex rounded-full px-4 py-1 items-center bg-green-500 bg-opacity-10 border border-green-500 border-opacity-20 h-9">
            <WalletIcon
              className={`text-green w-3 h-2.5 ${connectedWalletIconStyles}`}
            />

            <span className="hidden sm:block focus:outline-none ml-3 mr-1 text-sm font-whyte-regular">
              <span className="text-gray-syn4">
                {formattedAddress.slice(0, 2)}
              </span>
              {formattedAddress.slice(2)}
            </span>
            <div className="hidden sm:flex items-center ml-2">
              <img src="/images/chevron-down.svg" alt="down-arrow" />
            </div>
          </Menu.Button>
          <Transition
            show={open}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
            className="relative"
          >
            <Menu.Items
              as="ul"
              className="absolute right-0 w-80 mt-2 origin-top-right bg-gray-9 divide-y divide-gray-9 rounded-lg shadow-lg outline-none px-5 py-5"
            >
              <div>
                <p className="text-2xl leading-5">
                  {(+ethBalance).toFixed(3)} ETH
                </p>
                <div className="flex items-center mt-2">
                  <p className="text-sm text-gray-300 ">
                    {formatAddress(account, 11, 13)}
                  </p>
                  <CopyToClipboard
                    text={account}
                    onCopy={updateAddressCopyState}
                  >
                    <div className="ml-4 flex items-center ml-0 relative w-7 h-7 cursor-pointer rounded-full lg:hover:bg-gray-700 lg:active:bg-white lg:active:bg-opacity-20">
                      {showCopyState ? (
                        <span className="absolute text-xs -top-5 -left-1">
                          copied
                        </span>
                      ) : null}
                      <img
                        alt="copy"
                        src="/images/copy-clipboard.svg"
                        className="cursor-pointer h-4 mx-auto"
                      />
                    </div>
                  </CopyToClipboard>
                </div>

                <EtherscanLink
                  etherscanInfo={account}
                  customStyles="mt-4 text-base"
                />
                <div className="flex justify-between mt-4">
                  {renderConnectedWith(providerName)}
                </div>

                <div className="flex justify-center my-5">
                  <button
                    className="py-4 px-20 bg-gray-dark rounded-lg hover:bg-gray-dim text-sm"
                    onClick={disconnectWallet}
                  >
                    Disconnect Wallet
                  </button>
                </div>
              </div>
              <div>
                <div className="relative">
                  <div className="absolute bg-gradient-to-r from-gray-9 h-28 w-36" />
                  <img
                    alt="chrome-dark"
                    src={"/images/chrome-dark.svg"}
                    className=" h-32"
                  />
                </div>
                <div className="flex justify-center">
                  <p className="text-sm">Switch wallets directly in Metamask</p>
                </div>
                <div className="w-full mt-8">
                  <WalletConnectDemoButton buttonText="Switch to demo mode" />
                </div>
              </div>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
};

export default AddressMenuDropDown;
