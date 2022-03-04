import CreateClubButton from "@/components/createClubButton";
import PortfolioEmptyState from "@/components/syndicates/portfolioAndDiscover/portfolio/portfolioEmptyState";
import useClubERC20s from "@/hooks/useClubERC20s";
import { AppState } from "@/state";
import React from "react";
import { useSelector } from "react-redux";
import { SkeletonLoader } from "src/components/skeletonLoader";
import ClubERC20Table from "./portfolio/clubERC20Table";
import {
  clubERCTableColumns,
  MyClubERC20TableColumns,
} from "./portfolio/clubERC20Table/constants";
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
    clubERC20sReducer: { myClubERC20s, otherClubERC20s, loading },
  } = useSelector((state: AppState) => state);

  const {
    account,
    ethereumNetwork: { invalidEthereumNetwork },
  } = web3;

  useClubERC20s();

  // generate multiple skeleton loader components
  const generateSkeletons = (
    num: number,
    width: string,
    height: string,
    borderRadius?: string,
  ) => {
    const skeletonsWrapper = [];
    for (let i = 0; i < num; i++) {
      skeletonsWrapper.push(
        <div className="px-2 w-full" key={i}>
          <SkeletonLoader
            width={width}
            height={height}
            borderRadius={borderRadius}
          ></SkeletonLoader>
        </div>,
      );
    }
    return skeletonsWrapper;
  };

  return (
    <div className="-mt-8">
      {loading && account ? (
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
              {generateSkeletons(6, "28", "5", "rounded-md")}
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
                    {generateSkeletons(4, "30", "7", "rounded-md")}
                    {generateSkeletons(1, "30", "7", "rounded-full")}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <>
          {myClubERC20s.length || otherClubERC20s.length ? (
            <div>
              <div className="flex flex-col sm:flex-row justify-between sm:items-center w-full mt-14 mb-16">
                <p className="text-3xl">Portfolio</p>
                <CreateClubButton />
              </div>
              {/* show active clubsERC20s here */}
              {myClubERC20s.length ? (
                <div className="">
                  <p className="text-xl font-whyte mb-8">Admin</p>
                  {/* show active clubsERC20s here */}
                  <ClubERC20Table
                    tableData={myClubERC20s}
                    columns={MyClubERC20TableColumns}
                  />
                </div>
              ) : null}
              {otherClubERC20s.length ? (
                <div className="mt-16">
                  <p className="text-xl font-whyte mb-8">Member</p>
                  {/* show active clubsERC20s here */}
                  <ClubERC20Table
                    tableData={otherClubERC20s}
                    columns={clubERCTableColumns}
                  />
                </div>
              ) : null}
            </div>
          ) : !myClubERC20s.length && !invalidEthereumNetwork ? (
            <PortfolioEmptyState />
          ) : null}
        </>
      )}
    </div>
  );
};

export default PortfolioAndDiscover;
