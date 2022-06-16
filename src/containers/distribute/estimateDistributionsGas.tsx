import { getNativeTokenPrice } from '@/utils/api/transactions';
import { AppState } from '@/state';
import { getWeiAmount } from '@/utils/conversions';
import { isDev } from '@/utils/environment';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const baseURL = isDev
  ? 'https://api-rinkeby.etherscan.io/api'
  : 'https://api.etherscan.io/api';

const EstimateDistributionsGas = (props: {
  customClasses?: string;
  ethDepositToken?: boolean;
}) => {
  const {
    web3Reducer: {
      web3: { account, activeNetwork, web3 }
    },
    initializeContractsReducer: {
      syndicateContracts: { clubERC20Factory, clubERC20FactoryNative }
    }
  } = useSelector((state: AppState) => state);

  const { customClasses = '', ethDepositToken } = props;

  const [gas, setGas] = useState(0);
  const [gasUnits, setGasUnits] = useState(0);
  const [gasBaseFee, setGasBaseFee] = useState(0);
  const [ethTokenPrice, setEthTokenPrice] = useState<number | undefined>();

  const processBaseFee = async (result) => {
    const baseFee = result.result;
    const baseFeeInDecimal = parseInt(baseFee, 16);
    setGasBaseFee(baseFeeInDecimal);
  };

  const fetchGasUnitAndBaseFeeERC20 = useCallback(async () => {
    if (!clubERC20Factory) return;

    await Promise.all([
      !account
        ? setGasUnits(380000)
        : clubERC20Factory.getEstimateGasDistributeERC20(account, setGasUnits),
      axios
        .get(`${baseURL}?module=proxy&action=eth_gasPrice`)
        .then((res) => processBaseFee(res.data))
        .catch(() => 0),
      getNativeTokenPrice(activeNetwork.chainId)
        .then((res) => setEthTokenPrice(res))
        .catch(() => 0)
    ]);
  }, [account, clubERC20Factory]);

  const fetchGasUnitAndBaseFeeETH = useCallback(async () => {
    if (!clubERC20FactoryNative) return;

    await Promise.all([
      !account
        ? setGasUnits(380000)
        : clubERC20FactoryNative.getEstimateGasDistributeETH(
            account,
            setGasUnits
          ),
      axios
        .get(`${baseURL}?module=proxy&action=eth_gasPrice`)
        .then((res) => processBaseFee(res.data))
        .catch(() => 0),
      getNativeTokenPrice(activeNetwork.chainId)
        .then((res) => setEthTokenPrice(res))
        .catch(() => 0)
    ]);
  }, [account, clubERC20FactoryNative]);

  useEffect(() => {
    if (!ethDepositToken) {
      void fetchGasUnitAndBaseFeeERC20();
    } else {
      void fetchGasUnitAndBaseFeeETH();
    }
  }, [fetchGasUnitAndBaseFeeERC20, fetchGasUnitAndBaseFeeETH, ethDepositToken]);

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
            ? `${gas.toFixed(6)} ETH ${
                ethTokenPrice
                  ? '(~$' + (gas * ethTokenPrice).toFixed(2) + ')'
                  : ''
              }`
            : '- ETH'}
        </span>
      </span>
    </button>
  );
};

export default EstimateDistributionsGas;
