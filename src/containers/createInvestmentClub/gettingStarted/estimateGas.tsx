import { getNativeTokenPrice } from '@/utils/api/etherscan';
import { AppState } from '@/state';
import { getWeiAmount } from '@/utils/conversions';
import { isDev } from '@/utils/environment';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const EstimateGas = (props: { customClasses?: string }) => {
  const {
    web3Reducer: {
      web3: { account, activeNetwork }
    },
    initializeContractsReducer: {
      syndicateContracts: { clubERC20Factory }
    }
  } = useSelector((state: AppState) => state);

  const { customClasses = '' } = props;

  const [gas, setGas] = useState(0); // 0.05 ETH (~$121.77)
  const [gasUnits, setGasUnits] = useState(0);
  const [gasBaseFee, setGasBaseFee] = useState(0);
  const [nativeTokenPrice, setNativeTokenPrice] = useState();

  const processBaseFee = async (result) => {
    const baseFee = result.result;
    const baseFeeInDecimal = parseInt(baseFee, 16);
    console.log({ baseFeeInDecimal });
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
    void fetchGasUnitAndBaseFee();
  }, [fetchGasUnitAndBaseFee]);

  useEffect(() => {
    if (!gasUnits || !gasBaseFee) return;
    const estimatedGasInWei = gasUnits * (gasBaseFee + 2);
    const estimatedGas = getWeiAmount(estimatedGasInWei.toString(), 18, false);
    setGas(+estimatedGas);
  }, [gasUnits, gasBaseFee]);

  console.log({ gas, gasUnits, gasBaseFee });

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
