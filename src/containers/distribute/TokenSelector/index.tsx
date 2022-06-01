import { AssetList } from '@/components/distributions/assetList';
import { AppState } from '@/state';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import DistributionHeader from '../DistributionHeader';

const TokenSelector: React.FC<{ options }> = ({ options }) => {
  const {
    erc20TokenSliceReducer: {
      erc20Token: { symbol }
    }
  } = useSelector((state: AppState) => state);
  const [activeIndices, setActiveIndices] = useState([]);

  const handleMaxOnclick = (data) => {
    console.log({ data });
  };

  const handleOptionsChange = (option) => {
    console.log({ option });
  };

  return (
    <div>
      <DistributionHeader
        titleText="What would you like to distribute?"
        subTitleText={`Assets are distributed in proportion to members’ ownership of ${symbol} tokens.`}
      />
      <div className="flex text-gray-syn4 body mt-1">
        <img src="/images/question.svg" alt="" className="mr-2" />
        Why don’t NFTs show up here?
      </div>

      <div className="mt-9">
        {options.length ? (
          <AssetList
            options={options}
            activeIndices={activeIndices}
            handleOptionsChange={handleOptionsChange}
            handleActiveIndicesChange={setActiveIndices}
            handleMaxOnClick={handleMaxOnclick}
          />
        ) : (
          'No tokens'
        )}
      </div>
    </div>
  );
};

export default TokenSelector;
