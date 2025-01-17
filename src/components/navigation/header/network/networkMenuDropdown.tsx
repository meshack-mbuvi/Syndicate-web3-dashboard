import IconGas from '@/components/icons/Gas';
import IconInfo from '@/components/icons/info';
import IconWalletConnect from '@/components/icons/walletConnect';
import { useConnectWalletContext } from '@/context/ConnectWalletProvider';
import { getNetworkById, getNetworkByName } from '@/helpers/getNetwork';
import useWindowSize from '@/hooks/useWindowSize';
import { useProvider } from '@/hooks/web3/useProvider';
import { NETWORKS } from '@/Networks';
import { AppState } from '@/state';
import {
  setShowNetworkDropdownMenu,
  setShowWalletDropdownMenu
} from '@/state/wallet/actions';
import { isDev } from '@/utils/environment';
import { getFirstOrString } from '@/utils/stringUtils';
import { Popover, Transition } from '@headlessui/react';
import { useRouter } from 'next/router';
import React, { FC, useEffect, useState } from 'react';
import { useDetectClickOutside } from 'react-detect-click-outside';
import { useDispatch, useSelector } from 'react-redux';

const NetworkMenuDropDown: FC = () => {
  const {
    web3Reducer: {
      web3: { web3: web3Instance, account, activeNetwork },
      showNetworkDropdown,
      showWalletDropdown
    }
  } = useSelector((state: AppState) => state);
  const dispatch = useDispatch();
  const { width } = useWindowSize();

  const { switchNetworks } = useConnectWalletContext();
  const { providerName } = useProvider();

  const [nativeBalance, setNativeBalance] = useState('');
  const [blockNumber, setBlockNumber] = useState<number | string>();
  const [gas, setGas] = useState('');

  // Switch networks based on URL param
  const router = useRouter();
  const chain = getFirstOrString(router.query.chain);
  const network = getFirstOrString(router.query.network);

  useEffect(() => {
    let chainId;
    if (network) {
      const _chain = VerifyChainId(+network);
      chainId = +_chain;
    }
    if (chain) {
      const chainID = GetChainIdByName(chain);
      chainId = +chainID;
    }
    if (chainId) {
      switchNetworks?.(+chainId);
    }
  }, [network, chain]);

  const GetChainIdByName = (name: string): number => {
    const network = getNetworkByName(name);

    return network?.chainId;
  };

  const VerifyChainId = (chainId: any): number => {
    const network = getNetworkById(chainId);
    return network?.chainId || -1;
  };

  const getNativeBalance = async (address: string): Promise<void> => {
    try {
      const balance = (await web3Instance?.eth.getBalance(address)) || '0';
      const nativeBalance =
        web3Instance?.utils.fromWei(balance, 'ether') || '0';
      setNativeBalance(nativeBalance);
    } catch (error) {
      console.log({ error });
    }
  };

  const getGasAndBlock = async (): Promise<void> => {
    try {
      // block number of latest mined block
      await web3Instance?.eth.getBlockNumber().then((data: number) => {
        setBlockNumber(data);
      });
      await web3Instance?.eth.getGasPrice().then((value: string) => {
        const _gas = +web3Instance.utils.fromWei(value, 'gwei');
        setGas(String(Math.ceil(_gas)));
      });
    } catch (error) {
      console.log({ error });
    }
  };

  useEffect(() => {
    void getGasAndBlock();
  }, [web3Instance]);

  useEffect(() => {
    if (account && !nativeBalance) {
      void getNativeBalance(account);
    }
  }, [account, nativeBalance]);

  useEffect(() => {
    const gasAndBlockInterval = setInterval(() => {
      void getGasAndBlock();
    }, 3000);
    return () => {
      setBlockNumber('--');
      setGas('--');
      clearInterval(gasAndBlockInterval);
    };
  }, [activeNetwork]);

  const networkSwitchAction = (chainId: number): void => {
    providerName !== 'WalletConnect' ? switchNetworks?.(chainId) : null;
  };

  const toggleDropdown = (): void => {
    dispatch(setShowNetworkDropdownMenu(!showNetworkDropdown));
    dispatch(setShowWalletDropdownMenu(false));
  };

  const refId = 'networkButton';

  const closeDropdown = (event: any): void => {
    // find whether click is coming from any of the component in path
    const [isClickedInsideRefId] =
      event?.path?.filter((path: any) => path?.id === 'accountButton') || [];

    if (
      event.target?.id == '' &&
      event.target?.offsetParent?.id !== 'accountButton' &&
      event.target?.parentElement?.id !== 'accountButton'
    ) {
      if (showNetworkDropdown) dispatch(setShowNetworkDropdownMenu(false));

      if (showWalletDropdown && !isClickedInsideRefId) {
        dispatch(setShowWalletDropdownMenu(false));
      }
      return event;
    }

    if (event.target?.id !== refId && showNetworkDropdown) {
      dispatch(setShowNetworkDropdownMenu(false));
    } else if (
      (event.target?.offsetParent?.id == 'accountButton' ||
        event.target?.parentElement?.id == 'accountButton' ||
        isClickedInsideRefId) &&
      showWalletDropdown
    ) {
      dispatch(setShowWalletDropdownMenu(!showNetworkDropdown));
      return event;
    }
    return event;
  };

  const ref = useDetectClickOutside({ onTriggered: closeDropdown });

  return (
    <>
      <Popover as="div" className="relative">
        {() => {
          return (
            <>
              <button
                className={`flex justify-between sm:rounded-full w-full sm:w-auto sm:pl-3 pr-4 sm:py-2 items-center ${
                  showNetworkDropdown ? 'bg-gray-syn7' : 'bg-gray-syn8'
                } h-12 sm:h-10 sm:hover:bg-gray-syn7`}
                onClick={toggleDropdown}
                id={refId}
                ref={ref}
              >
                <div className="flex">
                  <img
                    width={24}
                    height={24}
                    className="mr-2"
                    src={activeNetwork.logo}
                    alt="chain logo"
                  />
                  <span
                    className={`${
                      width <= 425 ? 'flex' : 'block'
                    } text-gray-syn2 focus:outline-none text-base py-2`}
                  >
                    {activeNetwork.displayName}
                  </span>
                </div>
                <div className="flex items-center ml-2">
                  <img
                    src="/images/chevron-down.svg"
                    width="9"
                    alt="down-arrow"
                  />
                </div>
              </button>
              <Transition
                show={showNetworkDropdown}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
                className="relative z-10"
              >
                <Popover.Panel
                  static
                  as="ul"
                  className="absolute sm:right-0 w-64 mt-1 md:mt-2 origin-top-right bg-black rounded-2xl border border-gray-syn7 shadow-lg outline-none p-2 space-y-1"
                >
                  {Object.entries(NETWORKS).map(([key, value]) =>
                    value.testNetwork && !isDev ? (
                      <React.Fragment key={key}></React.Fragment>
                    ) : (
                      <button
                        className="w-full cursor-default"
                        key={key}
                        onClick={() => {
                          dispatch(
                            setShowNetworkDropdownMenu(!showNetworkDropdown)
                          );
                          if (value.chainId !== activeNetwork.chainId) {
                            networkSwitchAction(value.chainId);
                          }
                        }}
                      >
                        <div
                          className={`p-3 flex justify-between rounded-t-1.5lg ${
                            value.chainId === activeNetwork.chainId
                              ? `bg-${value.metadata.colors.background} bg-opacity-15 `
                              : `rounded-b-1.5lg ${
                                  providerName === 'WalletConnect'
                                    ? `cursor-not-allowed opacity-30`
                                    : `cursor-pointer  hover:bg-${value.metadata.colors.background} hover:bg-opacity-15`
                                }`
                          }`}
                        >
                          <span>{value.displayName}</span>
                          <span>
                            <img
                              width={20}
                              height={20}
                              src={value.logo}
                              alt=""
                            />
                          </span>
                        </div>

                        {value.chainId === activeNetwork.chainId && (
                          <div>
                            <div
                              className={`flex flex-col justify-between text-left px-3  pb-3 text-sm ${
                                value.chainId === activeNetwork.chainId
                                  ? `bg-${value.metadata.colors.background} bg-opacity-15`
                                  : 'rounded-b-1.5lg cursor-pointer'
                              }`}
                            >
                              <div className="text-green h-5 mb-1 flex items-center space-x-2">
                                <span className=" flex items-center justify-center h-2 w-2">
                                  <span className="bg-green h-1.5 w-1.5 block rounded-full"></span>
                                </span>
                                <span>BLOCK {blockNumber}</span>
                              </div>
                              <div className="flex items-center text-gray-syn4 h-5 space-x-2">
                                <IconGas width={8} height={8} />
                                <span>{gas + ' GWEI < 30 secs'}</span>
                              </div>
                            </div>
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
                                  src="/images/externalLinkWhite.svg"
                                  alt="extenal-link"
                                />
                              </span>
                            </a>
                          </div>
                        )}
                      </button>
                    )
                  )}
                  {providerName === 'WalletConnect' && (
                    <div className="text-sm p-3 pt-4 pb-4 border-t border-gray-syn7">
                      <IconWalletConnect width={24} height={24} />
                      <div className="pt-1">
                        You&#39;re using WalletConnect. To switch networks,
                        you&#39;ll need to do so directly in your wallet.
                      </div>
                      <a
                        className="pt-3 flex space-x-2 items-center text-gray-syn4"
                        href="https://guide.syndicate.io/support/frequently-asked-questions/wallet#wallet-support-guides"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <span> Learn more </span>{' '}
                        <IconInfo
                          width={16}
                          height={16}
                          textColorClass="text-gray-syn4"
                        />
                      </a>
                    </div>
                  )}
                </Popover.Panel>
              </Transition>
            </>
          );
        }}
      </Popover>
    </>
  );
};

export default NetworkMenuDropDown;
