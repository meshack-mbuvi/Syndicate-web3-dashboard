import { CopyToClipboardIcon } from '@/components/iconWrappers';
import { SkeletonLoader } from '@/components/skeletonLoader';
import { H1 } from '@/components/typography';
import { AppState } from '@/state';
import { useSelector } from 'react-redux';
import React, { useState } from 'react';
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
  const {
    web3Reducer: {
      web3: { activeNetwork }
    }
  } = useSelector((state: AppState) => state);

  // state to handle copying of the syndicate address to clipboard.
  const [showAddressCopyState, setShowAddressCopyState] =
    useState<boolean>(false);
  // show message to the user when address has been copied.
  const updateAddressCopyState = () => {
    setShowAddressCopyState(true);
    setTimeout(() => setShowAddressCopyState(false), 1000);
  };

  return (
    <div className="grid col-span-12">
      <div className="mr-8 col-start-1 col-end-3 flex items-center pb-3">
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

      <div className="flex-shrink flex-wrap break-normal col-start-4 col-end-10 flex items-center">
        {/* Syndicate name, symbol and action buttons  */}
        <div className="flex justify-start items-center group">
          {loading ? (
            <div className="md:w-96 w-50">
              <SkeletonLoader
                height="9"
                width="full"
                borderRadius="rounded-lg"
              />
            </div>
          ) : (
            <div
              className={`flex flex-wrap items-center justify-start w-fit-content space-y-2`}
            >
              <div className="flex justify-start items-center flex-wrap ">
                <H1
                  id="club-name"
                  extraClasses={`leading-13 line-clamp-2 mr-2`}
                >
                  {name}
                </H1>
                <div className="flex items-center">
                  <H1
                    weightClassOverride="font-light"
                    extraClasses="flex flex-wrap text-gray-syn4 items-center justify-center mr-8 leading-13"
                  >
                    {symbol}
                  </H1>

                  <div className="flex space-x-6 align-middle transition-opacity duration-200 opacity-100 sm:opacity-0 group-hover:opacity-100">
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
                        View on {activeNetwork.blockExplorer.name}
                      </ReactTooltip>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
