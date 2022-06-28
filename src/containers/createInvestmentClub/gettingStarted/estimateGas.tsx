import { getNativeTokenPrice } from '@/utils/api/transactions';
import { AppState } from '@/state';
import { getWeiAmount } from '@/utils/conversions';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const EstimateGas = (props: { customClasses?: string }) => {
  const {
    web3Reducer: {
      web3: { account, activeNetwork, web3 }
    },
    initializeContractsReducer: {
      syndicateContracts: { clubERC20Factory }
    }
  } = useSelector((state: AppState) => state);

  const { customClasses = '' } = props;

  const [gas, setGas] = useState(0); // 0.05 ETH (~$121.77)
  const [gasUnits, setGasUnits] = useState(0);
  const [gasBaseFee, setGasBaseFee] = useState(0);
  const [nativeTokenPrice, setNativeTokenPrice] = useState<
    number | undefined
  >();

  const processBaseFee = async (result) => {
    const baseFee = result.result;
    const baseFeeInDecimal = parseInt(baseFee, 16);
    setGasBaseFee(baseFeeInDecimal);
  };

  const fetchGasUnitAndBaseFee = useCallback(async () => {
    if (!clubERC20Factory) return;

    await Promise.all([
      !account
        ? setGasUnits(380000)
        : clubERC20Factory.getEstimateGas(account, setGasUnits),
      axios
        .get(
          `${activeNetwork.blockExplorer.api}/api?module=proxy&action=eth_gasPrice`
        )
        .then((res) => processBaseFee(res.data))
        .catch(() => 0),
      getNativeTokenPrice(activeNetwork.chainId)
        .then((res) => setNativeTokenPrice(res))
        .catch(() => 0)
    ]);
  }, [account, clubERC20Factory]);

  useEffect(() => {
    if (activeNetwork.chainId) {
      void fetchGasUnitAndBaseFee();
    }
  }, [fetchGasUnitAndBaseFee, activeNetwork]);

  useEffect(() => {
    if (!gasUnits || !gasBaseFee) return;
    const estimatedGasInWei = gasUnits * (gasBaseFee + 2);
    const estimatedGas = getWeiAmount(
      web3,
      estimatedGasInWei.toString(),
      18,
      false
    );
    setGas(+estimatedGas);
  }, [gasUnits, gasBaseFee]);

  return (
    <button
      className={
        !customClasses
          ? `bg-blue-navy bg-opacity-20 rounded-custom w-full flex py-2.5 cursor-default items-center`
          : `${customClasses}`
      }
    >
      <img src="/images/gasIcon.svg" className="inline w-4 h-4.5 mx-3" alt="" />
      <span className="flex justify-between w-full">
        <span className="text-blue">Estimated gas</span>
        <span className="mr-3 text-blue">
          {gas
            ? `${gas.toFixed(6)} ${activeNetwork.nativeCurrency.symbol} ${
                nativeTokenPrice
                  ? '(~$' + (gas * nativeTokenPrice).toFixed(2) + ')'
                  : ''
              }`
            : `- ${activeNetwork.nativeCurrency.symbol}`}
        </span>
      </span>
    </button>
  );
};

export default EstimateGas;
