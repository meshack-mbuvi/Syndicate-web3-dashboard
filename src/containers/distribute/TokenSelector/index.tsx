import { AssetList } from '@/components/distributions/assetList';
import { SkeletonLoader } from '@/components/skeletonLoader';
import { B3, B4 } from '@/components/typography';
import { IToken } from '@/state/assets/types';
import Image from 'next/image';
import React from 'react';
import ReactTooltip from 'react-tooltip';
import DistributionHeader from '../DistributionHeader';

interface Props {
  loading: boolean;
  symbol: string;
  options: IToken[];
  activeIndices: number[];
  handleOptionsChange: (options: IToken[]) => void;
  handleActiveIndicesChange: (indices: number[]) => void;
}

const TokenSelector: React.FC<Props> = ({
  options,
  activeIndices,
  handleOptionsChange,
  handleActiveIndicesChange,
  loading,
  symbol
}) => {
  return (
    <div>
      {!loading ? (
        <>
          <DistributionHeader
            titleText="What would you like to distribute and what amount?"
            subTitleText={`All assets within your Investment Club’s wallet are displayed for distribution.
            They will be distributed in proportion to members’ ownership of ${symbol} tokens.`}
          />
          <div className="mt-1">
            <div className="flex">
              <div
                data-tip
                data-for="why-nft-don't-show"
                id="why-nft-don't-show"
                className="flex space-x-2"
              >
                <Image
                  src="/images/question.svg"
                  alt=""
                  className="mr-2"
                  height={16}
                  width={16}
                />
                <B3 extraClasses="flex text-gray-syn4 hidden md:flex">
                  Why don’t NFTs show up here?
                </B3>
                <B4 extraClasses="flex text-gray-syn4 md:hidden">
                  Why don’t NFTs show up here?
                </B4>
              </div>

              <ReactTooltip
                id="why-nft-don't-show"
                place="right"
                effect="solid"
                className="actionsTooltip max-w-88"
                arrowColor="#222529"
                backgroundColor="#222529"
              >
                <B3 extraClasses="text-white leading-5.75 font-normal">
                  Individual NFTs cannot be distributed to multiple members
                  through Syndicate today. If the club exchanges the NFTs for
                  fungible ERC-20 tokens, they will be available for
                  distribution here.
                </B3>
              </ReactTooltip>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col justify-between">
          <SkeletonLoader width="1/3" height="6" />
          <SkeletonLoader width="2/3" height="5" />
          <SkeletonLoader width="1/3" height="5" />
        </div>
      )}

      <div className="mt-9">
        {loading && !options.length ? (
          [...Array(5).keys()].map((_, index) => (
            <div
              className="flex w-full justify-between -space-y-2 mx-6 py-3"
              key={index}
            >
              <div className="flex w-full self-center">
                <SkeletonLoader width="4/5" height="6" />
              </div>
              <div className="flex w-full flex-col space-y-1 items-end mr-10">
                <SkeletonLoader width="4/5" height="6" />
                <SkeletonLoader width="2/5" height="5" />
              </div>
            </div>
          ))
        ) : options.length ? (
          <AssetList
            options={options}
            activeIndices={activeIndices}
            handleOptionsChange={handleOptionsChange}
            handleActiveIndicesChange={handleActiveIndicesChange}
          />
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

export default TokenSelector;
