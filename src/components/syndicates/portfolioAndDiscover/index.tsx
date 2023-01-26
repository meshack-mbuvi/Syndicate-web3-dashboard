import CreateClubButton from '@/components/createClubButton';
import { H3 } from '@/components/typography';
import useWindowSize from '@/hooks/useWindowSize';
import { AppState } from '@/state';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { SkeletonLoader } from 'src/components/skeletonLoader';
import ClubERC20Table from './portfolio/clubERC20Table';
import {
  clubERCTableColumns,
  collectivesTableColumns,
  dealsTableColumns,
  MyClubERC20TableColumns
} from './portfolio/clubERC20Table/constants';
import CollectivesTable from './portfolio/collectivesTable';
import CreateEmptyState from '@/components/syndicates/portfolioAndDiscover/portfolio/portfolioEmptyState/createEmptyState';
import useIsPolygon from '@/hooks/collectives/useIsPolygon';
import SegmentedControl from '@/components/segmentedControl/tabs';
import useAdminCollectives from '@/hooks/collectives/useAdminCollectives';
import useMemberCollectives from '@/hooks/collectives/useMemberCollectives';
import useAdminClubs from '@/hooks/clubs/useAdminClubs';
import useMemberClubs from '@/hooks/clubs/useMemberClubs';
import useMemberDeals from '@/hooks/deals/useMemberDeals';
import useAdminDeals from '@/hooks/deals/useAdminDeals';
import useFeatureFlag from '@/hooks/useFeatureFlag';
import { FEATURE_FLAGS } from '@/pages/_app';
import CreateDealButton from '@/components/createDealButton';
import DealsTable from './portfolio/dealsTable';

// generate multiple skeleton loader components
const generateSkeletons = (
  num: number,
  width: string,
  height: string,
  borderRadius?: string
) =>
  [...Array(num)].map((_, i) => (
    <div className="px-2 w-full" key={i}>
      <SkeletonLoader
        width={width}
        height={height}
        borderRadius={borderRadius}
      />
    </div>
  ));

/**
 * My Syndicates: IF their wallet (a) is leading a syndicate or
 * (b) has deposited into a syndicate, the syndicates shows up on
 * this list. If the syndicate has been marked by the lead as
 *  “inactive,” the syndicate shows up in the inactive list.
 * Data is pulled from the smart contract and syndicate’s wallet state.
 * @returns
 */
const PortfolioAndDiscover: React.FC = () => {
  const {
    web3Reducer: { web3 }
  } = useSelector((state: AppState) => state);

  const {
    ethereumNetwork: { invalidEthereumNetwork },
    account
  } = web3;

  const { isReady: isCollectivesReady, readyClient: readyCollectivesClient } =
    useFeatureFlag(FEATURE_FLAGS.COLLECTIVES, {
      collectivesAllowlisted: true
    });

  const { isReady: isDealsReady, readyClient: readyDealsClient } =
    useFeatureFlag(FEATURE_FLAGS.DEALS, {});

  const { adminClubs, adminClubsLoading } = useAdminClubs();
  const { memberClubs, memberClubsLoading } = useMemberClubs();
  const isLoading = memberClubsLoading || adminClubsLoading;
  const { width } = useWindowSize();

  const { adminCollectives } = useAdminCollectives();
  const { memberCollectives } = useMemberCollectives();

  const { adminDeals } = useAdminDeals();
  const { memberDeals } = useMemberDeals();

  // Check to make sure collectives are not viewable on Polygon
  const { isPolygon } = useIsPolygon();

  enum TabsType {
    ADMIN = 0,
    MEMBER = 1
  }
  const [activeClubsTab, setActiveClubsTab] = useState<number>(TabsType.ADMIN);
  const [activeCollectivesTab, setActiveCollectivesTab] = useState<number>(
    TabsType.ADMIN
  );
  const [activeDealsTab, setActiveDealsTab] = useState<number>(TabsType.ADMIN);

  const filterOptions = [
    {
      label: 'Admin'
    },
    {
      label: 'Member'
    }
  ];

  // show only the available section when there's either
  // only admin or member clubs/collectives to show
  useEffect(() => {
    //clubs
    if (memberClubs.length === 0 && adminClubs.length !== 0) {
      setActiveClubsTab(TabsType.ADMIN);
    } else if (memberClubs.length !== 0 && adminClubs.length === 0) {
      setActiveClubsTab(TabsType.MEMBER);
    }

    // collectives
    if (memberCollectives.length === 0 && adminCollectives.length !== 0) {
      setActiveCollectivesTab(TabsType.ADMIN);
    } else if (
      memberCollectives.length !== 0 &&
      adminCollectives.length === 0
    ) {
      setActiveCollectivesTab(TabsType.MEMBER);
    }

    // deals
    if (memberDeals.length === 0 && adminDeals.length !== 0) {
      setActiveDealsTab(TabsType.ADMIN);
    } else if (
      memberCollectives.length !== 0 &&
      adminCollectives.length === 0
    ) {
      setActiveDealsTab(TabsType.MEMBER);
    }
  }, [
    adminCollectives.length,
    memberCollectives.length,
    memberClubs.length,
    adminClubs.length,
    adminDeals.length,
    memberDeals.length
  ]);

  const collectivesIsReady =
    (!isPolygon &&
      isCollectivesReady &&
      readyCollectivesClient &&
      readyCollectivesClient.treatment === 'on') ||
    false;

  const dealsIsReady =
    (!isPolygon &&
      isDealsReady &&
      readyDealsClient &&
      readyDealsClient.treatment === 'on') ||
    false;

  const emptyClubs = !memberClubs.length && !adminClubs.length;
  const emptyCollectives =
    !memberCollectives.length && !adminCollectives.length;
  const emptyDeals = !adminDeals.length && !memberDeals.length;

  // connected account does not belong to any collective or club or deal.
  if (
    (emptyClubs &&
      emptyCollectives &&
      emptyDeals &&
      !invalidEthereumNetwork &&
      !isLoading) ||
    !account
  ) {
    return (
      <div
        className="w-full flex justify-center md:h-100"
        style={{ marginTop: '144px' }}
      >
        <CreateEmptyState
          {...{
            emptyClubs,
            emptyCollectives: emptyCollectives && collectivesIsReady,
            emptyDeals: emptyDeals && dealsIsReady
          }}
        />
      </div>
    );
  }

  // connected account belongs to at least one club or collective.
  return (
    <div className="mt-8">
      {isLoading ? (
        <>
          {/* Loader content for large screens  */}
          <div className="hidden md:block">
            <div className="flex justify-between items-center w-full mt-14 mb-16">
              <SkeletonLoader width="32" height="8" borderRadius="rounded-lg" />
              <SkeletonLoader
                width="64"
                height="14"
                borderRadius="rounded-lg"
              />
            </div>
            <div className="mb-8">
              <SkeletonLoader
                width="28"
                height="8"
                borderRadius="rounded-full"
              />
            </div>
            <div className="">
              <div className="grid grid-cols-6 -mx-2">
                <div className="col-span-2">
                  {generateSkeletons(1, '28', '5', 'rounded-md')}
                </div>
                {generateSkeletons(4, '28', '5', 'rounded-md')}
              </div>
              <div className="mt-6 w-full divide-y-1 divide-gray-steelGrey">
                {[...Array(3)].map((_, index) => {
                  return (
                    <div
                      className={`grid grid-cols-6 pb-3 ${
                        index > 0 ? 'pt-3' : 'pt-0'
                      }`}
                      key={index}
                    >
                      <div className="flex justify-start items-center w-full col-span-2">
                        <SkeletonLoader
                          width="7"
                          height="7"
                          borderRadius="rounded-full mr-2"
                        />
                        <SkeletonLoader
                          width="2/3"
                          height="7"
                          borderRadius="rounded-md"
                        />
                      </div>
                      {generateSkeletons(3, '30', '7', 'rounded-md')}
                      {generateSkeletons(1, '30', '7', 'rounded-full')}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Loader content for mobile  */}
          <div className="md:hidden mr-6">
            <div className="flex flex-col w-full mt-14 mb-8 space-y-6">
              <SkeletonLoader width="28" height="8" borderRadius="rounded-lg" />
              <SkeletonLoader
                width="full"
                height="14"
                borderRadius="rounded-lg"
              />
            </div>
            <div className="mb-10">
              <SkeletonLoader
                width="32"
                height="8"
                borderRadius="rounded-full"
              />
            </div>

            <div className="w-full divide-y-1 divide-gray-steelGrey ">
              {[...Array(4)].map((_, index) => {
                return (
                  <div
                    className={`grid grid-cols-6 pb-3 ${
                      index > 0 ? 'pt-3' : 'pt-0'
                    }`}
                    key={index}
                  >
                    <div className="flex justify-start items-center w-full col-span-3">
                      <SkeletonLoader
                        width="7"
                        height="7"
                        margin="m-0"
                        borderRadius="rounded-full mr-2 flex-shrink-0"
                      />

                      <div className="flex flex-col space-y-2">
                        <SkeletonLoader
                          width="28"
                          height="6"
                          margin="m-0"
                          borderRadius="rounded-md sm:w-32"
                        />
                      </div>
                    </div>
                    <div className="col-span-3 flex flex-col justify-center items-end space-y-2">
                      <SkeletonLoader
                        width="28"
                        height="6"
                        margin="m-0"
                        borderRadius="rounded-md sm:w-32"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        // Investment clubs
        <>
          {!emptyClubs && !invalidEthereumNetwork && (
            <>
              <div
                className="flex flex-col sm:flex-row justify-between sm:items-center w-full mt-14"
                // @ts-expect-error TS(2322): Type '{ paddingRight: string; } | null' is not ass... Remove this comment to see the full error message
                style={width < 480 ? { paddingRight: '6%' } : null}
              >
                <H3>Clubs</H3>
                <div className="mt-7 sm:mt-0">
                  <CreateClubButton />
                </div>
              </div>
              <div className="mt-8">
                {memberClubs.length !== 0 && adminClubs.length !== 0 && (
                  <SegmentedControl
                    tabs={filterOptions}
                    activeIndex={activeClubsTab}
                    handleTabChange={setActiveClubsTab}
                  />
                )}
                <div className="mt-6 grid mr-6 sm:mr-0">
                  <div
                    className={`${
                      activeClubsTab === TabsType.ADMIN
                        ? 'opacity-100 z-10 h-full'
                        : 'opacity-0 z-0 h-0'
                    } transition-all duration-700 row-start-1 col-start-1 `}
                  >
                    <ClubERC20Table
                      tableData={adminClubs}
                      columns={MyClubERC20TableColumns}
                    />
                  </div>
                  <div
                    className={`${
                      activeClubsTab === TabsType.MEMBER
                        ? 'opacity-100 z-10 h-full'
                        : 'opacity-0 z-0 h-0'
                    } transition-all duration-700 row-start-1 col-start-1`}
                  >
                    <ClubERC20Table
                      tableData={memberClubs}
                      columns={clubERCTableColumns}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
          {/* Collectives  */}
          {collectivesIsReady && !invalidEthereumNetwork && !emptyCollectives && (
            <div className="mt-24 mr-6 sm:mr-0">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center w-full mt-14 mb-6">
                <H3>Collectives</H3>
                <div className="mt-7 sm:mt-0">
                  <CreateClubButton creatingClub={false} />
                </div>
              </div>
              <div className="mt-8">
                {memberCollectives.length !== 0 &&
                  adminCollectives.length !== 0 && (
                    <SegmentedControl
                      tabs={filterOptions}
                      activeIndex={activeCollectivesTab}
                      handleTabChange={setActiveCollectivesTab}
                    />
                  )}
                <div className="mt-6 grid">
                  <div
                    className={`${
                      activeCollectivesTab === TabsType.ADMIN
                        ? 'opacity-100 z-10 h-full'
                        : 'opacity-0 z-0 h-0'
                    } transition-all duration-700 row-start-1 col-start-1`}
                  >
                    <CollectivesTable
                      tableData={adminCollectives}
                      columns={collectivesTableColumns}
                    />
                  </div>

                  <div
                    className={`${
                      activeCollectivesTab === TabsType.MEMBER
                        ? 'opacity-100 z-10 h-full'
                        : 'opacity-0 z-0 h-0'
                    } transition-opacity duration-700 row-start-1 col-start-1`}
                  >
                    {activeCollectivesTab === TabsType.MEMBER && (
                      <CollectivesTable
                        tableData={memberCollectives}
                        columns={collectivesTableColumns}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Deals  */}
          {dealsIsReady && !invalidEthereumNetwork && !emptyDeals && (
            <div className="mt-24 mr-6 sm:mr-0">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center w-full mt-14 mb-6">
                <H3>Deals</H3>
                <div className="mt-7 sm:mt-0">
                  <CreateDealButton />
                </div>
              </div>
              <div className="mt-8">
                {memberDeals.length !== 0 && adminDeals.length !== 0 && (
                  <SegmentedControl
                    tabs={filterOptions}
                    activeIndex={activeDealsTab}
                    handleTabChange={setActiveDealsTab}
                  />
                )}
                <div className="mt-6 grid">
                  <div
                    className={`${
                      activeDealsTab === TabsType.ADMIN
                        ? 'opacity-100 z-10'
                        : 'opacity-0 z-0'
                    } transition-opacity duration-700 row-start-1 col-start-1`}
                  >
                    <DealsTable
                      tableData={adminDeals}
                      columns={dealsTableColumns}
                    />
                  </div>

                  <div
                    className={`${
                      activeDealsTab === TabsType.MEMBER
                        ? 'opacity-100 z-10'
                        : 'opacity-0 z-0'
                    } transition-opacity duration-700 row-start-1 col-start-1`}
                  >
                    {activeDealsTab === TabsType.MEMBER && (
                      <DealsTable
                        tableData={memberDeals}
                        columns={dealsTableColumns}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Empty State block */}
          <div className="flex">
            {(emptyClubs ||
              emptyCollectives ||
              emptyDeals ||
              invalidEthereumNetwork) && (
              <div
                className={'w-full flex justify-center'}
                style={{ marginTop: '144px' }}
              >
                <CreateEmptyState
                  {...{
                    emptyClubs,
                    emptyCollectives: emptyCollectives && collectivesIsReady,
                    emptyDeals: emptyDeals && dealsIsReady
                  }}
                />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PortfolioAndDiscover;
