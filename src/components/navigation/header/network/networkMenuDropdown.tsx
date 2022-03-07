import React, { useState, useEffect, FC } from "react";
import { Menu, Transition } from "@headlessui/react";
import { useConnectWalletContext } from "@/context/ConnectWalletProvider";
import { networks } from "@/Networks";

interface IAddressMenuDropDown {
  web3: any;
}

const NetworkMenuDropDown: FC<IAddressMenuDropDown> = ({ web3 }) => {
  /* ------------------------------------------------------------------------------------------------->
   * TODO: add  loading  states and detailed error states similar to what uniswap does
   *       add live gas prices
   *       add current block
   */

  const { switchNetworks } = useConnectWalletContext();

  const { account, web3: web3Instance, activeNetwork } = web3;

  const [ethBalance, setEthBalance] = useState("");

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

  return (
    <Menu as="div" className="relative">
      {({ open }) => (
        <>
          <Menu.Button
            className={`flex rounded-full pl-3 pr-3 py-2 sm:py-1 items-center ${
              open ? "bg-gray-syn7" : "bg-gray-syn8"
            } h-10 hover:bg-gray-syn7`}
          >
            <img
              width={20}
              height={20}
              className="mr-2"
              src={activeNetwork.logo}
              alt="chain logo"
            />
            <span className="block focus:outline-none mr-4 sm:mr-1 text-base leading-5.5 py-3 sm:text-sm font-whyte-regular">
              {activeNetwork.displayName}
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
              className="absolute right-0 w-80 mt-2 origin-top-right bg-black rounded-2xl border border-gray-syn7 shadow-lg outline-none p-2 space-y-1"
            >
              {Object.entries(networks).map(([key, value]) => (
                <button
                  className="w-full cursor-default"
                  key={value.chainId}
                  onClick={
                    value.chainId !== activeNetwork.chainId
                      ? () => {
                          switchNetworks(value.chainId);
                        }
                      : null
                  }
                >
                  <div
                    className={` p-3  flex justify-between rounded-t-1.5lg hover:bg-${
                      value.metadata.colors.background
                    } hover:bg-opacity-15 ${
                      value.chainId === activeNetwork.chainId
                        ? `bg-${value.metadata.colors.background} bg-opacity-15`
                        : "rounded-b-1.5lg cursor-pointer"
                    }`}
                  >
                    <span>{value.displayName}</span>
                    <span>
                      <img
                        width={20}
                        height={20}
                        src={value.logo}
                        alt="chain logo"
                      />
                    </span>
                  </div>
                  {value.chainId === activeNetwork.chainId && (
                    <a
                      className={`flex justify-between items-center text-sm p-3 border-t border-black bg-${value.metadata.colors.background}  bg-opacity-15 rounded-b-1.5lg cursor-pointer`}
                      href={value.blockExplorer.baseUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span>{value.blockExplorer.name}</span>
                      <span>
                        <img
                          className={`ml-2 w-4 text-white`}
                          src="/images/externalLinkGray.svg"
                          alt="extenal-link"
                        />
                      </span>
                    </a>
                  )}
                </button>
              ))}
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
};

export default NetworkMenuDropDown;
