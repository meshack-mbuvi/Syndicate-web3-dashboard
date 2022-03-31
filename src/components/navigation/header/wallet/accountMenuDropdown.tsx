import { BlockExplorerLink } from "@/components/syndicates/shared/BlockExplorerLink";
import React, { FC, useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Menu, Transition } from "@headlessui/react";
import { formatAddress } from "@/utils/formatAddress";
import { useConnectWalletContext } from "@/context/ConnectWalletProvider";
import { ExternalLinkColor } from "@/components/iconWrappers";
import WalletConnectDemoButton from "@/containers/layoutWithSyndicateDetails/demo/buttons/WalletConnectDemoButton";

interface IAddressMenuDropDown {
  web3: any;
}

const AddressMenuDropDown: FC<IAddressMenuDropDown> = ({
  web3: { account, providerName, web3 },
}) => {
  const { disconnectWallet } = useConnectWalletContext();

  const [showCopyState, setShowCopyState] = useState(false);
  const [nativeBalance, setNativeBalance] = useState('');

  const updateAddressCopyState = () => {
    setShowCopyState(true);
    setTimeout(() => setShowCopyState(false), 1000);
  };

  useEffect(() => {
    if (account && !nativeBalance) {
      web3.eth
        .getBalance(account)
        .then((balance) => web3.utils.fromWei(balance, 'ether'))
        .then(setNativeBalance);
    }
  }, [account, nativeBalance]);

  const formattedAddress = formatAddress(account, 7, 6);

  return (
    <Menu as="div" className="relative">
      {({ open }) => (
        <>
          <Menu.Button
            className={`flex rounded-full pl-5 pr-4 py-3 sm:py-1 items-center ${
              open ? "bg-gray-syn7" : "bg-gray-syn8"
            } h-10 hover:bg-gray-syn7`}
          >
            <span className="block focus:outline-none mr-4 sm:mr-1 text-base leading-5.5 py-3 sm:text-sm font-whyte-regular">
              <span className="text-gray-syn4">
                {formattedAddress.slice(0, 2)}
              </span>
              <span className="sm:hidden">
                {formatAddress(account, 13, 12).slice(2)}
              </span>
              <span className="hidden sm:inline-block">
                {formattedAddress.slice(2)}
              </span>
            </span>
            <div className="flex items-center ml-2">
              <img src="/images/chevron-down.svg" width="9" alt="down-arrow" />
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
              className="absolute right-0 w-80 mt-2 origin-top-right bg-black rounded-2xl border border-gray-syn7 shadow-lg outline-none p-2"
            >
              <div style={{ borderRadius: "0.625rem" }}>
                <div className="bg-gray-syn8 p-4 rounded-t-1.5lg rounded-b-none">
                  <div className="flex items-center">
                    <p className="">
                      <span className="text-gray-syn5">
                        {account.substring(0, 2)}
                      </span>
                      {formatAddress(account.substring(2), 6, 6)}
                    </p>
                  </div>
                  <div className="flex justify-between mt-2">
                    {renderConnectedWith(providerName)}
                  </div>
                </div>

                <div
                  className="bg-gray-syn8 p-4 rounded-b-1.5lg rounded-t-none"
                  style={{ marginTop: "1px" }}
                >
                  {/* Copy address */}
                  <CopyToClipboard
                    text={account}
                    onCopy={updateAddressCopyState}
                  >
                    <div className="text-sm mb-3 cursor-pointer">
                      <div className="flex justify-between hover:bg-gray-syn7 hover:p-2 hover:-m-2 rounded-lg">
                        <div>Copy address</div>
                        <div className="ml-4 flex items-center ml-0 relative lg:active:bg-opacity-20">
                          <span
                            className={`${
                              showCopyState ? "opacity-100" : "opacity-0"
                            } transition-opacity absolute text-xs -left-11 text-gray-syn4`}
                          >
                            copied
                          </span>
                          <img
                            alt="copy"
                            src="/images/actionIcons/copy-clipboard-white.svg"
                            className="cursor-pointer h-4 mx-auto"
                          />
                        </div>
                      </div>
                    </div>
                  </CopyToClipboard>

                  {/* View on Block Explorer */}
                  <div className="mb-4">
                    <BlockExplorerLink
                      resource={"address"}
                      resourceId={account}
                      customStyles="text-sm hover:bg-gray-syn7 hover:p-2 hover:-m-2 rounded-lg"
                      iconColor={ExternalLinkColor.WHITE}
                    />
                  </div>

                  <div className="flex justify-center">
                    <button
                      className="primary-CTA rounded-custom w-full"
                      onClick={disconnectWallet}
                    >
                      Disconnect
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <div className="w-full mt-2">
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

const renderConnectedWith = (providerName: string) => {
  let currentProvider;
  let imageLink;

  switch (providerName) {
    // case "Injected":
    //   currentProvider = "Metamask";
    //   imageLink = "/images/metamaskIcon.svg";
    //   break;
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
      <p className="text-sm text-gray-300">Connected with {currentProvider}</p>
      <img alt="icon" src={imageLink} className="inline h-5" />
    </>
  );
};

export default AddressMenuDropDown;
