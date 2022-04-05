import React from 'react';
import NumberTreatment from '@/components/NumberTreatment';
import { AppState } from '@/state';
import { useSelector } from 'react-redux';

const PriceContainer: React.FC<{
  numberValue: string;
  nativeValue?: boolean;
  customSymbol?: any;
  noUSDValue?: boolean;
  nativeDepositToken?: boolean;
  flexColumn?: boolean;
}> = ({
  numberValue,
  noUSDValue,
  nativeValue = false,
  customSymbol = 'USD',
  nativeDepositToken,
  flexColumn = 'true'
}) => {
  const {
    web3Reducer: {
      web3: { activeNetwork }
    }
  } = useSelector((state: AppState) => state);
  return (
    <div
      className={`text-base md:items-center ${
        flexColumn ? 'flex-col' : null
      } flex md:flex-row`}
    >
      <div>
        <NumberTreatment
          numberValue={numberValue}
          noUSDValue={noUSDValue}
          nativeDepositToken={nativeDepositToken}
        />
      </div>
      &nbsp;
      {nativeValue
        ? activeNetwork.nativeCurrency.symbol
        : `${noUSDValue ? '' : customSymbol}`}
    </div>
  );
};

export default PriceContainer;
