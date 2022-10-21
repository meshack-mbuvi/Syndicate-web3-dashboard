import IconCopy from '@/components/icons/copy';
import IconDisconnect from '@/components/icons/disconnect';
import IconExternal from '@/components/icons/external';
import IconPlus from '@/components/icons/plusIcon';
import walletDefaultImage from '@/features/auth/images/wallet-default.svg';
import {
  AddressImageSize,
  DisplayAddressWithENS
} from '@/components/shared/ensAddress/display';
import { Spinner } from '@/components/shared/spinner';
import { B2, B3, E2 } from '@/components/typography';
import React, { useEffect, useRef, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import ReactTooltip from 'react-tooltip';
import { CTAButton } from '@/components/CTAButton';

interface Props {
  walletProviderName?: string;
  wallets?: { address: string; name: string; avatar?: string }[];
  walletIsLoadingIndex?: number;
  externalLink?: string;
  activeWalletIndex?: number;
  isActiveWalletAContract?: boolean;
  handleDisconnect: () => void;
  handleWalletChange: (nonActiveWalletIndex: number) => void;
  handleLinkWalletClick: () => void;
  handleAccountSettingsClick: () => void;
  handleSignOutClick: () => void;
}

const AuthAccountSwitcherDropdown: React.FC<Props> = ({
  walletProviderName,
  wallets,
  walletIsLoadingIndex,
  externalLink,
  activeWalletIndex,
  isActiveWalletAContract = false,
  handleDisconnect,
  handleWalletChange,
  handleLinkWalletClick,
  handleAccountSettingsClick,
  handleSignOutClick
}) => {
  let activeWallet: { address: string; name: string; avatar?: string } | null =
    null;
  let nonActiveWallets:
    | { address: string; name: string; avatar?: string }[]
    | null = null;
  const isValidAcitveWalletIndex =
    activeWalletIndex !== undefined && activeWalletIndex !== null;
  if (isValidAcitveWalletIndex && wallets) {
    console.log('');
    activeWallet = wallets[activeWalletIndex];
    nonActiveWallets = [
      ...wallets.slice(0, activeWalletIndex),
      ...wallets.slice(activeWalletIndex + 1)
    ];
  } else if (wallets) {
    nonActiveWallets = wallets;
  }
  const displayActiveWallet = isValidAcitveWalletIndex && wallets;
  const displayNonActiveWallets = wallets && nonActiveWallets;
  const isValidWalletIsLoadingIndex =
    walletIsLoadingIndex !== null && walletIsLoadingIndex !== undefined;
  const showConnectWalletState =
    !displayActiveWallet && !displayNonActiveWallets;
  const walletContainer = useRef<HTMLDivElement>(null);
  const [areWalletsOverflowing, setAreWalletsOverflowing] = useState(false);
  useEffect(() => {
    if (
      walletContainer.current &&
      walletContainer.current?.getBoundingClientRect().height >= 320
    ) {
      setAreWalletsOverflowing(true);
    } else {
      setAreWalletsOverflowing(false);
    }
  }, [wallets]);
  const ActiveWallet = (): JSX.Element => {
    return (
      <div className={`rounded-custom bg-gray-syn8 divide-y`}>
        <div className="px-4 py-2 flex items-center space-x-2">
          <div className="w-1.5 h-1.5 bg-green rounded-full flex-shrink-0" />
          <div className="uppercase text-gray-syn3 text-xs font-mono">
            Connected with {walletProviderName}
          </div>
        </div>
        <div className="border-black px-4 py-2 flex items-center justify-between space-x-2">
          <DisplayAddressWithENS
            name={activeWallet?.name}
            address={activeWallet?.address}
            image={
              activeWallet?.avatar ? activeWallet?.avatar : walletDefaultImage
            }
            imageSize={AddressImageSize.SMALL}
            customTailwindXSpacingUnit={3}
          />
          <div className="flex space-x-4 items-center">
            {/* Copy to clipboard */}
            <CopyToClipboard
              text={
                wallets && isValidAcitveWalletIndex
                  ? wallets[activeWalletIndex].address
                  : ''
              }
            >
              <button>
                <ReactTooltip
                  id="copy-tooltip"
                  place="top"
                  effect="solid"
                  className="actionsTooltip w-42"
                  arrowColor="#222529"
                  backgroundColor="#222529"
                >
                  <B3>Copy address</B3>
                </ReactTooltip>
                <IconCopy
                  width={16}
                  height={16}
                  data-tip
                  data-for="copy-tooltip"
                  extraClasses="focus:outline-none focus:ring-0"
                />
              </button>
            </CopyToClipboard>

            {/* External link */}
            {externalLink && (
              <a href={externalLink} target="_blank" rel="noreferrer">
                <ReactTooltip
                  id="external-tooltip"
                  place="top"
                  effect="solid"
                  className="actionsTooltip w-42"
                  arrowColor="#222529"
                  backgroundColor="#222529"
                >
                  <B3>View on Etherscan</B3>
                </ReactTooltip>
                <IconExternal
                  width={16}
                  height={16}
                  data-tip
                  data-for="external-tooltip"
                  extraClasses="focus:outline-none focus:ring-0"
                />
              </a>
            )}

            {/* Disconnect wallet */}
            <button onClick={handleDisconnect}>
              <ReactTooltip
                id="disconnect-tooltip"
                place="top"
                effect="solid"
                className="actionsTooltip w-42"
                arrowColor="#222529"
                backgroundColor="#222529"
              >
                <B3>Disconnect wallet</B3>
              </ReactTooltip>
              <IconDisconnect
                fill="#90949E"
                data-tip
                data-for="disconnect-tooltip"
                extraClasses="focus:outline-none focus:ring-0"
              />
            </button>
          </div>
        </div>
      </div>
    );
  };
  return (
    <>
      <div
        className={`rounded-2.5xl w-full p-2 border-gray-syn7 border`}
        style={{
          width: '18.75rem'
        }}
      >
        {isActiveWalletAContract && (
          <div>
            <div className="pb-4">
              <E2 extraClasses={`text-gray-syn3 pt-2 pb-4 pl-3`}>
                Contract wallet
              </E2>
              <ActiveWallet />
            </div>

            {/* Bottom line */}
            <div className={`h-1px -mx-2 bg-gray-syn7`} />
          </div>
        )}

        {/* Wallet overflow container */}
        <div
          ref={walletContainer}
          className={`overflow-scroll w-full no-scroll-bar rounded-t-custom`}
          style={{
            maxHeight: '320px'
          }}
        >
          {isActiveWalletAContract && (
            <E2 extraClasses={`text-gray-syn3 pt-3 pb-5 pl-3`}>
              Syndicate Account
            </E2>
          )}

          {/* Active + non active wallets */}
          <div className="space-y-2 pb-2">
            {/* Active wallet */}
            {displayActiveWallet && !isActiveWalletAContract && (
              <ActiveWallet />
            )}

            {/* Other addresses */}
            {displayNonActiveWallets && nonActiveWallets ? (
              <>
                {nonActiveWallets.map((wallet, index) => {
                  return (
                    <button
                      key={index}
                      onClick={() => {
                        handleWalletChange(wallets.indexOf(wallet));
                      }}
                      className="flex justify-between items-center visibility-container border text-left w-full border-gray-syn7 hover:border-gray-syn6 rounded-custom h-14 px-4"
                    >
                      <DisplayAddressWithENS
                        name={wallet.name}
                        address={wallet.address}
                        image={
                          wallet.avatar ? wallet.avatar : walletDefaultImage
                        }
                        customTailwindXSpacingUnit={3}
                      />
                      {isValidWalletIsLoadingIndex &&
                      walletIsLoadingIndex === wallets.indexOf(wallet) ? (
                        <Spinner width="w-6" height="h-6" />
                      ) : (
                        <B2
                          weightClassOverride="font-medium"
                          extraClasses="text-blue-neptune visibility-hover invisible transition-all"
                        >
                          Connect
                        </B2>
                      )}
                    </button>
                  );
                })}
              </>
            ) : (
              <div className="p-3">
                <CTAButton extraClasses="short py-2 rounded-full font-semibold">
                  Connect wallet
                </CTAButton>
              </div>
            )}

            {/* Add new wallet */}
            {wallets && (
              <button
                className="flex items-center space-x-3 py-3 px-4 w-full text-left rounded-custom border-transparent border hover:border-gray-syn7 transition-all"
                onClick={handleLinkWalletClick}
              >
                <div className="rounded-full h-6 w-6 bg-gray-syn7">
                  <IconPlus
                    width={12}
                    height={12}
                    fill="#B8BDC7"
                    extraClasses="mx-auto vertically-center"
                  />
                </div>
                <div>Link wallet</div>
              </button>
            )}
          </div>
        </div>

        {/* Divider */}
        <div
          className={`h-1px ${
            showConnectWalletState
              ? 'mx-3'
              : areWalletsOverflowing
              ? '-mx-2'
              : 'mx-4'
          } bg-gray-syn7`}
        />

        {/* Settings, sign out */}
        <div
          className={`px-4 ${
            showConnectWalletState ? 'pt-4' : 'pt-4'
          } pb-3 space-y-4`}
        >
          <button
            onClick={handleAccountSettingsClick}
            className="w-full text-left"
          >
            Account settings
          </button>
          <button onClick={handleSignOutClick} className="w-full text-left">
            Sign out
          </button>
        </div>
      </div>
    </>
  );
};

export default AuthAccountSwitcherDropdown;
