import React from 'react';
import { AppState } from '@/state';
import { useSelector } from 'react-redux';
import { floatedNumberWithCommas } from '@/utils/formattedNumbers';
import PriceContainer from './PriceContainer';

const TokenDetail: React.FC<{ title: string; value: any; symbol?: any }> = ({
  title,
  value,
  symbol
}) => {
  const {
    assetsSliceReducer: { ethereumTokenPrice }
  } = useSelector((state: AppState) => state);

  const blankValue = <span className="text-gray-syn4">-</span>;
  let floorPriceFormattedTotalValue, purchasePriceFormattedTotalValue;
  let clubBalance, balanceValue;
  if (title === 'Floor price') {
    const floorPriceValue = value * ethereumTokenPrice;

    floorPriceFormattedTotalValue = floorPriceValue ? (
      <div className="flex flex-col items-end">
        {' '}
        <PriceContainer numberValue={value} ethValue={true} />
        <div className="text-gray-syn4">
          {floatedNumberWithCommas(floorPriceValue)} USD
        </div>
      </div>
    ) : (
      blankValue
    );
  }

  if (title === 'Last purchase price') {
    const { lastPurchasePriceUSD, lastPurchasePriceETH } = value;

    purchasePriceFormattedTotalValue = lastPurchasePriceUSD ? (
      <div className="flex flex-col items-end">
        <PriceContainer numberValue={lastPurchasePriceETH} ethValue={true} />
        <div className="text-gray-syn4">
          {floatedNumberWithCommas(lastPurchasePriceUSD)} USD
        </div>
      </div>
    ) : (
      blankValue
    );
  }

  if (title === 'Club balance') {
    balanceValue = (
      <div className="flex flex-col items-end">
        <PriceContainer numberValue={value} customSymbol={symbol} />
      </div>
    );
  }

  if (title === 'Value') {
    clubBalance = (
      <div className="flex flex-col items-end">
        <PriceContainer
          numberValue={value}
          ethValue={false}
          noUSDValue={+value === 0}
        />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between py-4 border-b-1 border-gray-syn6">
      <div className="text-gray-syn4 w-1/2">
        <span>{title}</span>
      </div>
      <div className="w-1/2 text-right overflow-scroll no-scroll-bar">
        {purchasePriceFormattedTotalValue
          ? purchasePriceFormattedTotalValue
          : floorPriceFormattedTotalValue
          ? floorPriceFormattedTotalValue
          : clubBalance || balanceValue || value
          ? value
          : blankValue}
      </div>
    </div>
  );
};

export default TokenDetail;
