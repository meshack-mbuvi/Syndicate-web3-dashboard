import { showWalletModal } from '@/state/wallet/actions';
import { Status } from '@/state/wallet/types';
import { formatAddress } from '@/utils/formatAddress';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '@/state';
import AddressMenuDropDown from './accountMenuDropdown';
import React from 'react';
import { useDemoMode } from '@/hooks/useDemoMode';

export const Wallet: React.FC = () => {
  /**
   * This web3 is coming from the provider that is connected using the
   * hook web3modal.
   * The instance is in the application's store and is passed here as props
   */
  const {
    web3Reducer: { web3 }
  } = useSelector((state: AppState) => state);

  const { status } = web3;
  const dispatch = useDispatch();

  const isDemoMode = useDemoMode();

  /**
   * open variable is used to determine whether to show or hide
   *  the wallet connection modal.
   */
  const connectWallet = () => {
    dispatch(showWalletModal());
  };

  const NotConnectedButton = () => (
    <button
      onClick={connectWallet}
      className={`bg-white text-black flex relative rounded-full px-5 py-1 items-center h-10 primary-CTA`}
    >
      Connect
    </button>
  );

  const formattedDemoAddress = formatAddress(
    '0x2502947319f2166eF46f0a7c081D23C63f88112B',
    7,
    6
  );

  const DemoConnectButton = () => (
    <div
      className={`bg-gray-syn8 flex relative rounded-full px-4 py-1 items-center h-10`}
    >
      <img
        src={'/images/status/gamecontroller.svg'}
        width="16.56"
        alt="demo icon"
        className="mr-2"
      />
      <span className="focus:outline-none ml-1 sm:ml-0 mr-3 sm:mr-1 text-base leading-5.5 sm:text-sm font-whyte-regular">
        <span className="text-gray-syn4">
          {formattedDemoAddress.slice(0, 2)}
        </span>
        {formattedDemoAddress.slice(2)}
      </span>
      <div className="flex items-center ml-2">
        <img src="/images/chevron-down.svg" alt="down-arrow" />
      </div>
    </div>
  );

  if (isDemoMode) {
    return <DemoConnectButton />;
  }

  return (
    <>
      {/* hide wallet on signin page */}
      <div className="wallet-connect">
        {status === Status.CONNECTED ? (
          <AddressMenuDropDown Web3={web3} />
        ) : (
          <NotConnectedButton />
        )}
      </div>
    </>
  );
};

export default Wallet;
