import IconGas from '@/components/icons/Gas';
import IconWalletConnect from '@/components/icons/walletConnect';
import IconInfo from '@/components/icons/info';
import { useConnectWalletContext } from '@/context/ConnectWalletProvider';
import { useGetNetwork, useGetNetworkById } from '@/hooks/web3/useGetNetwork';
import { useProvider } from '@/hooks/web3/useProvider';
import { NETWORKS } from '@/Networks';
import { AppState } from '@/state';
import { isDev } from '@/utils/environment';
import { Menu, Transition } from '@headlessui/react';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { useRouter } from 'next/router';
import React, { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const NetworkMenuDropDown: FC = () => {
  const {
    web3Reducer: {
      web3: { web3: web3Instance, account, activeNetwork }
    }
  } = useSelector((state: AppState) => state);

  const { polygon } = useFlags();

  const { switchNetworks } = useConnectWalletContext();
  const { providerName } = useProvider();

  const [nativeBalance, setNativeBalance] = useState('');
  const [blockNumber, setblockNumber] = useState('');
  const [gas, setGas] = useState('');

  // Switch networks based on URL param
  const router = useRouter();
  const { network, chain } = router.query;

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
      switchNetworks(+chainId);
    }
  }, [network, chain]);

  const GetChainIdByName = (name) => {
    const network = useGetNetwork(name);

    return network?.chainId;
  };

  const VerifyChainId = (chainId) => {
    const network = useGetNetworkById(chainId);
    return network?.chainId;
  };

  const getNativeBalance = async (address: string) => {
    try {
      const balance = await web3Instance.eth.getBalance(address);
      const nativeBalance = web3Instance.utils.fromWei(balance, 'ether');
      setNativeBalance(nativeBalance);
    } catch (error) {
      console.log({ error });
    }
  };

  const getGasAndBlock = async () => {
    // block number of latest mined block
    await web3Instance.eth.getBlockNumber().then((data) => {
      setblockNumber(data);
    });
    await web3Instance.eth.getGasPrice().then((value) => {
      const _gas = +web3Instance.utils.fromWei(value, 'gwei');
      setGas(String(Math.ceil(_gas)));
    });
  };

  useEffect(() => {
    getGasAndBlock();
  }, [web3Instance]);

  useEffect(() => {
    if (account && !nativeBalance) {
      getNativeBalance(account);
    }
  }, [account, nativeBalance]);

  useEffect(() => {
    const gasAndBlockInterval = setInterval(() => {
      getGasAndBlock();
    }, 3000);
    return () => {
      setblockNumber('--');
      setGas('--');
      clearInterval(gasAndBlockInterval);
    };
  }, [activeNetwork]);

  const networkSwitchAction = (chainId) => {
    providerName !== 'WalletConnect' ? switchNetworks(chainId) : null;
  };

  return (
    <Menu as="div" className="relative">
      {({ open }) => (
        <>
          <Menu.Button
            className={`flex rounded-full pl-3 pr-3 py-2 sm:py-1 items-center ${
              open ? 'bg-gray-syn7' : 'bg-gray-syn8'
            } h-10 hover:bg-gray-syn7`}
          >
            <img
              width={20}
              height={20}
              className="mr-2"
              src={activeNetwork.logo}
              alt="chain logo"
            />
            <span className="block focus:outline-none mr-4 sm:mr-1 text-base leading-5.5 py-2 sm:text-sm font-whyte-regular">
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
              className="absolute right-0 w-64 mt-2 origin-top-right bg-black rounded-2xl border border-gray-syn7 shadow-lg outline-none p-2 space-y-1"
            >
              {Object.entries(NETWORKS).map(([key, value]) =>
                (value.testNetwork && !isDev) ||
                (!polygon && Number(key) === 137) ? (
                  <React.Fragment key={key}></React.Fragment>
                ) : (
                  <button
                    className="w-full cursor-default"
                    key={key}
                    onClick={
                      value.chainId !== activeNetwork.chainId
                        ? () => {
                            networkSwitchAction(value.chainId);
                          }
                        : null
                    }
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
                        <img width={20} height={20} src={value.logo} alt="" />
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
                    href="https://guide.syndicate.io/frequently-asked-questions/wallet#wallet-support-guides"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span> Learn more </span>{' '}
                    <IconInfo width={16} height={16} fill={'#90949E'} />
                  </a>
                </div>
              )}
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
};

export default NetworkMenuDropDown;
