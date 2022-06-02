import { CopyToClipboardIcon } from '@/components/iconWrappers';
import { SkeletonLoader } from '@/components/skeletonLoader';
import { H1 } from '@/components/typography';
import { getTextWidth } from '@/utils/getTextWidth';
import React, { useEffect, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import ReactTooltip from 'react-tooltip';
import GradientAvatar from '../../portfolioAndDiscover/portfolio/GradientAvatar';
import { BlockExplorerLink } from '../BlockExplorerLink';

export const ClubHeader: React.FC<{
  name;
  symbol;
  owner;
  loading;
  clubAddress;
  totalDeposits;
  loadingClubDeposits;
  managerSettingsOpen;
}> = (props) => {
  const {
    name,
    symbol,
    owner,
    loading,
    clubAddress,
    totalDeposits,
    loadingClubDeposits,
    managerSettingsOpen
  } = props;
  const [divWidth, setDivWidth] = useState(0);
  const [nameWidth, setNameWidth] = useState(0);

  const [showActionIcons, setShowActionIcons] = useState<boolean>(false);

  // state to handle copying of the syndicate address to clipboard.
  const [showAddressCopyState, setShowAddressCopyState] =
    useState<boolean>(false);
  // show message to the user when address has been copied.
  const updateAddressCopyState = () => {
    setShowAddressCopyState(true);
    setTimeout(() => setShowAddressCopyState(false), 1000);
  };

  // perform size checks
  useEffect(() => {
    setDivWidth(document?.getElementById('club-name')?.offsetWidth);
    setNameWidth(getTextWidth(name));
  }, [name]);
  return (
    <div className="flex justify-center items-center">
      <div className="mr-8">
        {(loading || loadingClubDeposits || totalDeposits == '') &&
        !managerSettingsOpen ? (
          <SkeletonLoader height="20" width="20" borderRadius="rounded-full" />
        ) : clubAddress ? (
          <GradientAvatar
            name={name}
            size="xl:w-20 lg:w-16 xl:h-20 lg:h-16 w-10 h-10"
          />
        ) : null}
      </div>

      <div className="flex-shrink flex-wrap break-normal m-0 w-full">
        {/* Syndicate name, symbol and action buttons  */}
        <div
          className="flex justify-start items-center"
          onMouseEnter={() => setShowActionIcons(true)}
          onMouseLeave={() => setShowActionIcons(false)}
        >
          {loading ? (
            <div className="md:w-96 w-50">
              <SkeletonLoader
                height="9"
                width="full"
                borderRadius="rounded-lg"
              />
            </div>
          ) : (
            <div className={`flex flex-wrap items-center w-fit-content`}>
              <H1
                id="club-name"
                extraClasses={`${
                  nameWidth >= divWidth ? `line-clamp-2 mb-2` : `flex mr-6`
                }`}
              >
                {name}
              </H1>
              <H1
                weightClassOverride="font-light"
                extraClasses="flex flex-wrap text-gray-syn4 items-center justify-center"
              >
                {symbol}
              </H1>
              <div className="block items-center ml-6 space-x-8 pr-2">
                {showActionIcons ? (
                  <div className="flex space-x-6">
                    <CopyToClipboard text={owner as string}>
                      <button
                        className="flex items-center relative w-4 h-4 cursor-pointer"
                        onClick={updateAddressCopyState}
                        onKeyDown={updateAddressCopyState}
                        data-for="copy-club-address"
                        data-tip
                      >
                        {showAddressCopyState ? (
                          <span className="absolute text-xs -bottom-5">
                            copied
                          </span>
                        ) : null}
                        <ReactTooltip
                          id="copy-club-address"
                          place="top"
                          effect="solid"
                          className="actionsTooltip"
                          arrowColor="transparent"
                          backgroundColor="#131416"
                        >
                          Copy club wallet address
                        </ReactTooltip>

                        <CopyToClipboardIcon color="text-gray-syn5 hover:text-gray-syn4" />
                      </button>
                    </CopyToClipboard>

                    <div data-for="view-on-etherscan" data-tip>
                      <BlockExplorerLink
                        customStyles="w-4 h-4"
                        resource={'address'}
                        resourceId={owner}
                        grouped
                        iconOnly
                      />
                      <ReactTooltip
                        id="view-on-etherscan"
                        place="top"
                        effect="solid"
                        className="actionsTooltip"
                        arrowColor="transparent"
                        backgroundColor="#131416"
                      >
                        View on Etherscan
                      </ReactTooltip>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
