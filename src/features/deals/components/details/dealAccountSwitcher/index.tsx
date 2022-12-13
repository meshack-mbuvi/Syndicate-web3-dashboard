import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { B3 } from '@/components/typography';
import { floatedNumberWithCommas } from '@/utils/formattedNumbers';
import {
  AddressImageSize,
  AddressLayout,
  DisplayAddressWithENS
} from '@/components/shared/ensAddress/display';
import { Wallet } from '@/features/deals/components/details/dealAllocationCard';
import { Transition } from '@headlessui/react';

interface DealAccountSwitcherProps {
  wallets: Wallet[] | [];
  dealCommitTokenSymbol: string;
  walletBalance: string;
  walletProviderName: string;
  connectedWallet: Wallet;
  handleAccountSwitch: (address: string) => void;
  disableSwitching?: boolean;
}

const DealAccountSwitcher: React.FC<DealAccountSwitcherProps> = ({
  wallets,
  dealCommitTokenSymbol,
  walletBalance,
  walletProviderName,
  connectedWallet,
  handleAccountSwitch,
  disableSwitching = false
}) => {
  const accountsDropdown = useRef<HTMLButtonElement>(null);
  const [isAccountSwitcherOpen, setIsAccountSwitcherOpen] = useState(false);

  // close account switcher drop-down when clicking outside of it.
  // or selecting an account
  useEffect(() => {
    const onPageClickEvent = (e: Event): void => {
      if (
        accountsDropdown.current !== null &&
        !accountsDropdown.current.contains(e.target as Node)
      ) {
        setIsAccountSwitcherOpen(!isAccountSwitcherOpen);
        return;
      }
    };
    if (isAccountSwitcherOpen) {
      window.addEventListener('click', onPageClickEvent);
    }

    return (): void => {
      window.removeEventListener('click', onPageClickEvent);
    };
  }, [isAccountSwitcherOpen]);

  return (
    <button
      className="border border-gray-syn7 rounded-lg p-4 cursor-pointer w-full flex justify-between items-center relative"
      onClick={() => {
        if (!disableSwitching) {
          setIsAccountSwitcherOpen(!isAccountSwitcherOpen);
        }
      }}
      ref={accountsDropdown}
    >
      {/* wallet name and address  */}
      <div className="flex flex-col space-y-1.5">
        <DisplayAddressWithENS
          name={connectedWallet.name}
          address={connectedWallet.address}
          userPlaceholderImg={connectedWallet.avatar}
          imageSize={AddressImageSize.SMALLEST}
          customTailwindXSpacingUnit={3}
          layout={AddressLayout.ONE_LINE}
          extraClasses="text-base"
        />
        {/* wallet account balance  */}
        <div className="flex items-center space-x-2">
          <Image
            src="/images/default-wallet.svg"
            width={18}
            height={18}
            alt="wallet"
          />
          <B3 extraClasses="text-gray-syn4">{`${floatedNumberWithCommas(
            walletBalance
          )} ${dealCommitTokenSymbol}`}</B3>
        </div>
      </div>

      {!disableSwitching && (
        <img src="/images/chevron-down.svg" width="15" alt="down-arrow" />
      )}

      {/* account switcher dropdown  */}
      <Transition
        show={isAccountSwitcherOpen}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
        className="absolute border z-10 bg-black border-gray-syn7 rounded-1.5lg top-2 left-2
        right-2"
      >
        {/* current connected account  */}
        <div className="flex flex-col space-y-0.5 m-1">
          <div className="rounded-t-lg bg-gray-syn8 pt-3 pb-2 px-5">
            <DisplayAddressWithENS
              name={connectedWallet.name}
              address={connectedWallet.address}
              userPlaceholderImg={connectedWallet.avatar}
              imageSize={AddressImageSize.SMALLEST}
              customTailwindXSpacingUnit={3}
              layout={AddressLayout.ONE_LINE}
              extraClasses="text-base"
            />
          </div>

          <div className="px-5 py-2 flex items-center space-x-2 rounded-b-lg bg-gray-syn8">
            <div className="w-1.5 h-1.5 bg-green rounded-full flex-shrink-0" />
            <div className="uppercase text-gray-syn3 text-xs font-mono">
              Connected with {walletProviderName}
            </div>
          </div>
        </div>

        {/* other acounts  */}
        {wallets.length ? (
          <div className="px-5 py-2 flex flex-col space-y-2">
            {wallets.map((wallet: Wallet, index: number) => {
              return (
                <button
                  className="flex hover:bg-gray-syn8 p-2 rounded-lg"
                  key={index}
                  onClick={() => handleAccountSwitch(wallet.address)}
                >
                  <DisplayAddressWithENS
                    address={wallet.address}
                    image={wallet.avatar}
                    imageSize={AddressImageSize.SMALLEST}
                    customTailwindXSpacingUnit={3}
                    layout={AddressLayout.ONE_LINE}
                    extraClasses="text-base"
                  />
                </button>
              );
            })}
          </div>
        ) : null}
      </Transition>
    </button>
  );
};

export default DealAccountSwitcher;
