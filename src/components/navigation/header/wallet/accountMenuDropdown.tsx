import { ExternalLinkColor } from '@/components/iconWrappers';
import {
  AddressImageSize,
  AddressLayout,
  AddressWithENS
} from '@/components/shared/ensAddress';
import { BlockExplorerLink } from '@/components/syndicates/shared/BlockExplorerLink';
import WalletConnectDemoButton from '@/containers/layoutWithSyndicateDetails/demo/buttons/WalletConnectDemoButton';
import { useConnectWalletContext } from '@/context/ConnectWalletProvider';
import useFetchEnsAssets from '@/hooks/useFetchEnsAssets';
import useWindowSize from '@/hooks/useWindowSize';
import {
  setShowNetworkDropdownMenu,
  setShowWalletDropdownMenu
} from '@/state/wallet/actions';
import { formatAddress } from '@/utils/formatAddress';
import { Popover, Transition } from '@headlessui/react';
import { FC, useEffect, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useDispatch } from 'react-redux';

import { useDetectClickOutside } from 'react-detect-click-outside';

interface IAddressMenuDropDown {
  Web3: any;
  showWalletDropdown: boolean;
}

const AddressMenuDropDown: FC<IAddressMenuDropDown> = ({
  Web3: { account, providerName, web3, ensResolver },
  showWalletDropdown
}) => {
  const { disconnectWallet } = useConnectWalletContext();
  const { width } = useWindowSize();

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

  const formattedAddress = formatAddress(account, 6, 4);

  const { data } = useFetchEnsAssets(ensResolver);
  const dispatch = useDispatch();

  const toggleDropdown = () => {
    dispatch(setShowWalletDropdownMenu(!showWalletDropdown));
    dispatch(setShowNetworkDropdownMenu(false));
  };

  const refId = 'accountButton';

  const closeDropdown = (event) => {
    if (
      !account ||
      event.target?.id == refId ||
      event.target?.offsetParent?.id == refId
    )
      return event;
    if (event.target?.id !== refId || event.target?.id == '') {
      dispatch(setShowWalletDropdownMenu(false));
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
                className={`flex rounded-full w-auto sm:w-20 md:w-auto pl-5 sm:pl-3 md:pl-3 pr-4 py-3 sm:py-1 items-center ${
                  showWalletDropdown ? 'bg-gray-syn7' : 'bg-gray-syn8'
                } h-10 hover:bg-gray-syn7`}
                onClick={toggleDropdown}
                ref={ref}
                id={refId}
              >
                <img
                  width={24}
                  height={24}
                  className={`${
                    width > 425 ? 'mr-2 block md:hidden' : 'hidden'
                  }`}
                  src={data?.avatar || '/images/jazzicon.png'}
                  alt=""
                />
                <div className={`${width <= 425 ? 'flex' : 'hidden md:flex'}`}>
                  <AddressWithENS
                    address={{ label: formattedAddress }}
                    name={data?.name}
                    image={{ src: data?.avatar, size: AddressImageSize.SMALL }}
                    layout={AddressLayout.ONE_LINE}
                    id={refId}
                    extraClasses={`${!data?.avatar && 'ml-1'}`}
                  />
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
                show={showWalletDropdown}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
                className="relative"
              >
                <Popover.Panel
                  static
                  as="ul"
                  className="absolute sm:right-0 w-80 mt-2 origin-top-right bg-black rounded-2xl border border-gray-syn7 shadow-lg outline-none p-2"
                >
                  <div style={{ borderRadius: '0.625rem' }}>
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
                      style={{ marginTop: '1px' }}
                    >
                      {/* Copy address */}
                      <CopyToClipboard
                        text={account}
                        onCopy={updateAddressCopyState}
                      >
                        <div className="text-sm mb-3 cursor-pointer">
                          <div className="flex justify-between hover:bg-gray-syn7 hover:p-2 hover:-m-2 rounded-lg">
                            <div>Copy address</div>
                            <div className="ml-4 flex items-center relative lg:active:bg-opacity-20">
                              <span
                                className={`${
                                  showCopyState ? 'opacity-100' : 'opacity-0'
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
                          resource={'address'}
                          resourceId={account}
                          customStyles="text-sm hover:bg-gray-syn7 hover:p-2 hover:-m-2 rounded-lg"
                          iconcolor={ExternalLinkColor.WHITE}
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
                </Popover.Panel>
              </Transition>
            </>
          );
        }}
      </Popover>
    </>
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
    case 'WalletConnect':
      currentProvider = 'WalletConnect';
      imageLink = '/images/walletConnect.svg';
      break;
    case 'GnosisSafe':
      currentProvider = 'Gnosis Safe';
      imageLink = '/images/gnosisSafe.png';
      break;
    default:
      currentProvider = 'Metamask';
      imageLink = '/images/metamaskIcon.svg';
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
