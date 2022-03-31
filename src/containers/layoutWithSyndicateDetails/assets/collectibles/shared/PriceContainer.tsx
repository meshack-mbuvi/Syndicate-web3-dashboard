import React from 'react';
import NumberTreatment from '@/components/NumberTreatment';

const PriceContainer: React.FC<{
  numberValue: string;
  ethValue?: boolean;
  customSymbol?: any;
  noUSDValue?: boolean;
  ethDepositToken?: boolean;
  flexColumn?: boolean;
}> = ({
  numberValue,
  noUSDValue,
  ethValue = false,
  customSymbol = 'USD',
  ethDepositToken,
  flexColumn = 'true'
}) => {
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
          ethDepositToken={ethDepositToken}
        />
      </div>
      &nbsp;
      {ethValue ? 'ETH' : `${noUSDValue ? '' : customSymbol}`}
    </div>
  );
};

export default PriceContainer;
