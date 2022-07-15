import { AssetList } from '@/components/distributions/assetList';
import { SkeletonLoader } from '@/components/skeletonLoader';
import { B3, B4 } from '@/components/typography';
import { AppState } from '@/state';
import Image from 'next/image';
import React from 'react';
import { useSelector } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import DistributionHeader from '../DistributionHeader';

const TokenSelector: React.FC<{
  options;
  activeIndices;
  setOptions;
  setActiveIndices;
  loading;
}> = ({ options, activeIndices, setOptions, setActiveIndices, loading }) => {
  const {
    erc20TokenSliceReducer: {
      erc20Token: { symbol }
    }
  } = useSelector((state: AppState) => state);

  return (
    <div>
      <DistributionHeader
        titleText="What would you like to distribute?"
        subTitleText={`Assets are distributed in proportion to members’ ownership of ${symbol} tokens.`}
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
              src="/images/question-gray5.svg"
              alt=""
              className="mr-2"
              height={16}
              width={16}
            />
            <B3 extraClasses="flex text-gray-syn5 hidden md:flex">
              Why don’t NFTs show up here?
            </B3>
            <B4 extraClasses="flex text-gray-syn5 md:hidden">
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
              Individual NFTs cannot be distributed to multiple members through
              Syndicate today. If the club exchanges the NFTs for fungible
              ERC-20 tokens, they will be available for distribution here.
            </B3>
          </ReactTooltip>
        </div>
      </div>

      <div className="mt-9">
        {loading && !options.length ? (
          [1, 2, 3, 4].map((_, index) => (
            <div className="-space-y-2 mx-6 py-3" key={index}>
              <div className="flex justify-between">
                <SkeletonLoader width="1/3" height="6" />

                <SkeletonLoader width="1/3" height="6" />
              </div>
              <div className="flex justify-end">
                <SkeletonLoader width="1/6" height="5" />
              </div>
            </div>
          ))
        ) : options.length ? (
          <AssetList
            options={options}
            activeIndices={activeIndices}
            handleOptionsChange={setOptions}
            handleActiveIndicesChange={setActiveIndices}
          />
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

export default TokenSelector;
