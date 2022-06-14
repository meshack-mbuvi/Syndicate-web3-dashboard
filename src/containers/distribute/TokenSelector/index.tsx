import { AssetList } from '@/components/distributions/assetList';
import { SkeletonLoader } from '@/components/skeletonLoader';
import { B3, B4 } from '@/components/typography';
import { AppState } from '@/state';
import React from 'react';
import { useSelector } from 'react-redux';
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
      <div>
        <div className="hidden md:block">
          <B3 extraClasses="flex text-gray-syn5 mt-2">
            <img src="/images/question-gray5.svg" alt="" className="mr-2" />
            Why don’t NFTs show up here?
          </B3>
        </div>
        <div className="md:hidden">
          <B4 extraClasses="flex text-gray-syn5 mt-2">
            <img src="/images/question-gray5.svg" alt="" className="mr-2" />
            Why don’t NFTs show up here?
          </B4>
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
        ) : null}
      </div>
    </div>
  );
};

export default TokenSelector;
