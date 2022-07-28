import { AppState } from '@/state';
import React from 'react';
import { useSelector } from 'react-redux';

const EstimatedGas = (props: { gas: number; customClasses?: string }) => {
  const { gas, customClasses = '' } = props;

  const {
    web3Reducer: {
      web3: { activeNetwork }
    }
  } = useSelector((state: AppState) => state);

  return (
    <button
      className={
        !customClasses
          ? `bg-blue-navy bg-opacity-20 rounded-custom w-full flex py-2.5 cursor-default items-center`
          : `${customClasses}`
      }
    >
      <span className="flex flex-col lg:flex-row space-x-0 lg:space-x-6 space-y-6 lg:space-y-0 justify-center lg:justify-between w-full px-3">
        <div className="flex items-center space-x-3 justify-center lg:justify-start">
          <img src="/images/gasIcon.svg" className="inline w-4 h-4.5" alt="" />
          <span className="text-blue ">Estimated gas</span>
        </div>

        <span className="mr-3 text-blue">
          {gas
            ? `${gas.toFixed(6)} ${activeNetwork.nativeCurrency.symbol}`
            : `- ${activeNetwork.nativeCurrency.symbol}`}
        </span>
      </span>
    </button>
  );
};

export default EstimatedGas;
