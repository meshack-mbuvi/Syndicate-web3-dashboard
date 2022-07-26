import CreateClubButton from '@/components/createClubButton';
import PortfolioEmptyState from '@/components/syndicates/portfolioAndDiscover/portfolio/portfolioEmptyState/club';
import TabsButton from '@/components/TabsButton';
import { H3 } from '@/components/typography';
import useCollectives from '@/hooks/collectives/useGetCollectives';
import useClubERC20s from '@/hooks/useClubERC20s';
import useWindowSize from '@/hooks/useWindowSize';
import { AppState } from '@/state';
import { useFlags } from 'launchdarkly-react-client-sdk';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { SkeletonLoader } from 'src/components/skeletonLoader';
import ClubERC20Table from './portfolio/clubERC20Table';
import {
  clubERCTableColumns,
  collectivesTableColumns,
  MyClubERC20TableColumns
} from './portfolio/clubERC20Table/constants';
import CollectivesTable from './portfolio/collectivesTable';

// generate multiple skeleton loader components
const generateSkeletons = (
  num: number,
  width: string,
  height: string,
  borderRadius?: string
) =>
  Array(num).map((_, i) => (
    <div className="px-2 w-full" key={i}>
      <SkeletonLoader
        width={width}
        height={height}
        borderRadius={borderRadius}
      />
    </div>
  ));

// empty state for an individual tab (collectives and clubs)
const EmptyState: React.FC<{
  title: string;
  subTitle: string;
  showCreateButton: boolean;
  creatingClub?: boolean;
}> = ({ title, subTitle, showCreateButton, creatingClub }) => {
  return (
    <div className="mt-10 w-full h-48 flex justify-center items-center">
      <div className="text-center">
        <span className="text-lg md:text-2xl">{title}</span>
        <p className="text-gray-syn4 pt-2.5 max-w-112">{subTitle}</p>
        {showCreateButton && (
          <div className="mt-6 flex justify-center">
            <CreateClubButton {...{ creatingClub }} />
          </div>
        )}
      </div>
    </div>
  );
};

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
    web3Reducer: { web3 },
    clubERC20sReducer: { myClubERC20s, otherClubERC20s },
    collectivesSlice: { adminCollectives, memberCollectives }
  } = useSelector((state: AppState) => state);

  const {
    ethereumNetwork: { invalidEthereumNetwork }
  } = web3;

  const { collectives } = useFlags();

  const { isLoading } = useClubERC20s();

  const { width } = useWindowSize();

  useCollectives();

  enum TabsType {
    ADMIN = 'ADMIN',
    MEMBER = 'MEMBER'
  }
  const [activeClubsTab, setActiveClubsTab] = useState<TabsType | string>(
    TabsType.ADMIN
  );
  const [activeCollectivesTab, setActiveCollectivesTab] = useState<
    TabsType | string
  >(TabsType.ADMIN);

  const filterOptions = [
    {
      label: 'Admin',
      value: TabsType.ADMIN
    },
    {
      label: 'Member',
      value: TabsType.MEMBER
    }
  ];

  // show only the available section when there's either
  // only admin or member clubs/collectives to show
  useEffect(() => {
    //clubs
    if (otherClubERC20s.length === 0 && myClubERC20s.length !== 0) {
      setActiveClubsTab(TabsType.ADMIN);
    } else if (otherClubERC20s.length !== 0 && myClubERC20s.length === 0) {
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminCollectives.length, memberCollectives.length]);

  return (
    <div className="-mt-8">
      {isLoading ? (
        <div>
          <div className="flex justify-between items-center w-full mt-14 mb-16">
            <SkeletonLoader width="32" height="8" borderRadius="rounded-lg" />
            <SkeletonLoader width="64" height="14" borderRadius="rounded-lg" />
          </div>
          <div className="mb-8">
            <SkeletonLoader width="20" height="6" borderRadius="rounded-md" />
          </div>
          <div className="">
            <div className="grid grid-cols-6 -mx-2">
              {generateSkeletons(6, '28', '5', 'rounded-md')}
            </div>
            <div className="mt-6 border-b-1 w-full border-gray-steelGrey">
              {[1, 2].map((index) => {
                return (
                  <div className="grid grid-cols-6 pb-3" key={index}>
                    <div className="flex justify-evenly items-center w-full">
                      <SkeletonLoader
                        width="7"
                        height="7"
                        borderRadius="rounded-full"
                      />
                      <SkeletonLoader
                        width="2/3"
                        height="7"
                        borderRadius="rounded-md"
                      />
                    </div>
                    {generateSkeletons(4, '30', '7', 'rounded-md')}
                    {generateSkeletons(1, '30', '7', 'rounded-full')}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        // Investment clubs
        <>
          <div
            className="flex flex-col sm:flex-row justify-between sm:items-center w-full mt-14"
            style={width < 480 ? { paddingRight: '6%' } : null}
          >
            <H3>Clubs</H3>
            {otherClubERC20s.length !== 0 || myClubERC20s.length !== 0 ? (
              <CreateClubButton />
            ) : null}
          </div>

          {myClubERC20s.length || otherClubERC20s.length ? (
            <div className="mt-6">
              {otherClubERC20s.length !== 0 && myClubERC20s.length !== 0 && (
                <TabsButton
                  options={filterOptions}
                  value={TabsType.ADMIN}
                  onChange={(val) => setActiveClubsTab(val)}
                  activeTab={activeClubsTab}
                />
              )}
              <div className="mt-6 grid">
                <div
                  className={`${
                    activeClubsTab === TabsType.ADMIN
                      ? 'opacity-100 z-10'
                      : 'opacity-0 z-0'
                  } transition-all duration-700 row-start-1 col-start-1 `}
                >
                  <ClubERC20Table
                    tableData={myClubERC20s}
                    columns={MyClubERC20TableColumns}
                  />
                </div>

                <div
                  className={`${
                    activeClubsTab === TabsType.MEMBER
                      ? 'opacity-100 z-10'
                      : 'opacity-0 z-0'
                  } transition-opacity duration-700 row-start-1 col-start-1`}
                >
                  <ClubERC20Table
                    tableData={otherClubERC20s}
                    columns={clubERCTableColumns}
                  />
                </div>
              </div>
            </div>
          ) : !myClubERC20s.length && !invalidEthereumNetwork ? (
            <PortfolioEmptyState />
          ) : null}

          {/* Collectives  */}
          {collectives && (
            <div className="mt-24">
              <div
                className="flex flex-col sm:flex-row justify-between sm:items-center w-full mt-14 mb-6"
                style={width < 480 ? { paddingRight: '6%' } : null}
              >
                <H3>Collectives</H3>
                {memberCollectives.length !== 0 ||
                adminCollectives.length !== 0 ? (
                  <CreateClubButton creatingClub={false} />
                ) : null}
              </div>
              {memberCollectives.length !== 0 ||
              adminCollectives.length !== 0 ? (
                <div className="mt-6">
                  {memberCollectives.length !== 0 &&
                    adminCollectives.length !== 0 && (
                      <TabsButton
                        options={filterOptions}
                        value={TabsType.ADMIN}
                        onChange={(val) => setActiveCollectivesTab(val)}
                        activeTab={activeCollectivesTab}
                      />
                    )}
                  <div className="mt-6 grid">
                    <div
                      className={`${
                        activeCollectivesTab === TabsType.ADMIN
                          ? 'opacity-100 z-10'
                          : 'opacity-0 z-0'
                      } transition-opacity duration-700 row-start-1 col-start-1`}
                    >
                      <CollectivesTable
                        tableData={adminCollectives}
                        columns={collectivesTableColumns}
                      />
                    </div>

                    <div
                      className={`${
                        activeCollectivesTab === TabsType.MEMBER
                          ? 'opacity-100 z-10'
                          : 'opacity-0 z-0'
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
              ) : (
                <EmptyState
                  {...{
                    title: 'You’re not in any collectives yet.',
                    subTitle:
                      'Organize your purpose-driven community and customize social experiences across web3',
                    showCreateButton: true,
                    creatingClub: false
                  }}
                />
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PortfolioAndDiscover;
