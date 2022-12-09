import { AppState } from '@/state';
import { formatAddress } from '@/utils/formatAddress';
import React, { useMemo, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useSelector } from 'react-redux';
import TrashIcon from '@/components/icons/TrashIcon';
import { DotsVerticalIcon } from '@heroicons/react/outline';
import OnlineIcon from '@/components/icons/social/online';
import {
  CopyToClipboardIcon,
  ExternalLinkColor,
  ExternalLinkIcon
} from '@/components/iconWrappers';
import { B2, B4, M1 } from '@/components/typography';
import ReactTooltip from 'react-tooltip';

interface ITooltipProp {
  title: string;
  showBadge?: boolean;
}

/**
 * Logic in this file can be changed based on data we get from backend
 */
const WalletCard: React.FC<{
  networks: string[];
  linkedAddress: string;
  clubs: { admin: string[]; member: string[] };
  collectives: { admin: string[]; member: string[] };
}> = ({ networks, linkedAddress, clubs, collectives }) => {
  const {
    web3Reducer: {
      web3: {
        activeNetwork: { blockExplorer }
      }
    }
  } = useSelector((state: AppState) => state);

  const isConnectedWallet =
    linkedAddress === '0x302d2274156925a2c4e4dd8D9568c415eEF66410'; // TODO: [Auth] use this condition linkedAddress === account;

  // TODO: [Auth] uncomment useFetchEnsAssets to enable ens
  // const { data } = useFetchEnsAssets(linkedAddress, ethersProvider);
  // The code below is only good for storybooks. Pls delete during logic implementation
  const data = {
    name:
      linkedAddress === '0x302d2274156925a2c4e4dd8D9568c415eEF66410'
        ? 'bertie.eth'
        : null
  };

  const totalAssets = [
    ...clubs.admin,
    ...clubs.member,
    ...collectives.admin,
    ...collectives.member
  ];

  const [showCopyState, setShowCopyState] = useState(false);
  const [displayedAssets, setDisplayedAssets] = useState<string[]>();

  const walletInfo = useMemo(() => {
    const info = [networks.join(', ')];
    const _displayedAssets = [];
    if (clubs.admin.length) {
      info.push(`Club wallet for ${clubs.admin[0]}`);
      _displayedAssets.push(clubs.admin[0]);
    }
    if (clubs.member.length) {
      info.push(`Member of ${clubs.member[0]}`);
      _displayedAssets.push(clubs.member[0]);
    }
    if (collectives.admin.length && info.length <= 2) {
      info.push(`Admin wallet for ${collectives.admin[0]}`);
      _displayedAssets.push(collectives.admin[0]);
    }
    if (collectives.member.length && info.length <= 2) {
      info.push(`Member of ${collectives.member[0]}`);
      _displayedAssets.push(collectives.member[0]);
    }
    setDisplayedAssets(_displayedAssets);

    return info.join(' • ');
  }, [clubs, collectives, networks]);

  const [tooltipClubs, tooltipCollectives] = useMemo(() => {
    if (!displayedAssets) return [[], []];
    // Clubs
    const _clubs: ITooltipProp[] = [];

    // Admin clubs
    clubs.admin.forEach((title) => {
      if (!displayedAssets.includes(title)) {
        _clubs.push({
          title,
          showBadge: true
        });
      }
    });

    // Member clubs
    clubs.member.forEach((title) => {
      if (!displayedAssets.includes(title)) {
        _clubs.push({
          title
        });
      }
    });

    // Collectives
    const _collectives: ITooltipProp[] = [];

    // Admin collectives
    collectives.admin.forEach((title) => {
      if (!displayedAssets.includes(title)) {
        _collectives.push({
          title,
          showBadge: true
        });
      }
    });

    // Member collectives
    collectives.member.forEach((title) => {
      if (!displayedAssets.includes(title)) {
        _collectives.push({
          title
        });
      }
    });

    return [_clubs, _collectives];
  }, [displayedAssets]);

  const updateAddressCopyState = (): void => {
    setShowCopyState(true);
    setTimeout(() => setShowCopyState(false), 1000);
  };

  const handleUnlink = (): void => {
    // TODO: [Auth] Stych call
  };

  return (
    <div className="flex flex-row justify-between items-center">
      <div className="flex flex-row items-center">
        <div className="pr-4 relative">
          <img
            src="/images/collectives/collectiveMemberAvatar.svg"
            alt="avator"
          />
          <div className="absolute top-0 right-2.5">
            {isConnectedWallet && <OnlineIcon />}
          </div>
        </div>

        <div className="flex flex-col space-y-1">
          <div>
            {data?.name ? (
              <div className="flex flex-row space-x-2">
                <B2>{data?.name}</B2>
                <B2 extraClasses="text-gray-syn4">
                  {formatAddress(linkedAddress, 6, 4)}
                </B2>
              </div>
            ) : (
              <B2>
                <span className="text-gray-syn4">0x</span>
                <span className="sm:inline-block hidden">
                  {linkedAddress.substring(2)}
                </span>
                <span className="sm:hidden inline-block">
                  {formatAddress(linkedAddress.slice(2), 6, 4)}
                </span>
              </B2>
            )}
          </div>

          <B4 extraClasses="text-gray-syn4 sm:inline-block hidden">
            {walletInfo}
            {totalAssets.length && totalAssets.length > 2 ? (
              <span
                data-tip
                data-for={linkedAddress}
                className="cursor-pointer"
              >
                ,&nbsp;
                <span className="underline">
                  +{totalAssets.length - 2} more
                </span>
              </span>
            ) : null}
          </B4>

          <ReactTooltip
            id={linkedAddress}
            place="right"
            effect="solid"
            className="actionsTooltip w-58"
            backgroundColor="#131416"
            textColor="#FFF"
            arrowColor="transparent"
          >
            <span className="text-white">
              {tooltipCollectives && tooltipCollectives.length ? (
                <div className="flex flex-col space-y-3 pb-5">
                  <M1 extraClasses="text-gray-syn3">Collectives</M1>
                  {tooltipCollectives.map((collective) => (
                    <div
                      className="flex flex-row space-x-2"
                      key={collective.title}
                    >
                      <B2>{collective.title}</B2>
                      {collective.showBadge && (
                        <B4 extraClasses="text-gray-syn4 bg-gray-syn7 rounded-full px-2 py-1">
                          Admin
                        </B4>
                      )}
                    </div>
                  ))}
                </div>
              ) : null}

              {tooltipClubs && tooltipClubs.length ? (
                <div className="flex flex-col space-y-3">
                  <M1 extraClasses="text-gray-syn3">Clubs</M1>
                  {tooltipClubs.map((club) => (
                    <div className="flex flex-row space-x-2" key={club.title}>
                      <B2>{club.title}</B2>
                      {club.showBadge && (
                        <B4 extraClasses="text-gray-syn4 bg-gray-syn7 rounded-full px-2 py-1">
                          Club wallet
                        </B4>
                      )}
                    </div>
                  ))}
                </div>
              ) : null}
            </span>
          </ReactTooltip>
        </div>
      </div>

      <button
        className="sm:hidden inline-block"
        onClick={(): null => null /* TODO: [Auth] open mobile modal */}
      >
        <DotsVerticalIcon className="text-gray-syn4 w-4 h-4" />
      </button>

      <div className="space-x-2 items-center sm:flex hidden">
        <CopyToClipboard text={linkedAddress} onCopy={updateAddressCopyState}>
          <div className="bg-gray-syn8 hover:bg-gray-syn7 rounded-1.5lg">
            <div className="relative cursor-pointer flex items-center p-4">
              {showCopyState && (
                <span className="absolute text-xs top-12 left-1">copied</span>
              )}
              <CopyToClipboardIcon color="text-gray-syn4" />
            </div>
          </div>
        </CopyToClipboard>

        <a
          href={`${blockExplorer.baseUrl}/${blockExplorer.resources.address}/${linkedAddress}`}
          target="_blank"
          rel="noreferrer"
          className="bg-gray-syn8 hover:bg-gray-syn7 rounded-1.5lg p-4"
        >
          <ExternalLinkIcon iconcolor={ExternalLinkColor.GRAY4} />
        </a>

        <button
          className="bg-gray-syn8 hover:bg-gray-syn7 rounded-1.5lg p-4"
          onClick={handleUnlink}
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  );
};

export default WalletCard;
