import { getNativeTokenPrice } from '@/utils/api/transactions';
import { AppState } from '@/state';
import { getWeiAmount } from '@/utils/conversions';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export enum ContractMapper {
  ClubERC20Factory,
  DistributionsERC20,
  DistributionsETH
}

interface Props {
  contract?: ContractMapper; // TODO shouldn't be optional
  customClasses?: string;
  withFiatCurrency?: boolean;
}

const EstimateGas: React.FC<Props> = ({
  contract = ContractMapper.ClubERC20Factory, // TODO shouldn't be optional
  customClasses = '',
  withFiatCurrency = false
}) => {
  const {
    web3Reducer: {
      web3: { account, activeNetwork, web3 }
    },
    initializeContractsReducer: {
      syndicateContracts: {
        clubERC20Factory,
        distributionsERC20,
        distributionsETH
      }
    }
  } = useSelector((state: AppState) => state);

  const [gas, setGas] = useState(0); // 0.05 ETH (~$121.77)
  const [gasUnits, setGasUnits] = useState(0);
  const [gasBaseFee, setGasBaseFee] = useState(0);
  const [nativeTokenPrice, setNativeTokenPrice] = useState<
    number | undefined
  >();
  const [fiatAmount, setFiatAmount] = useState('');

  const contracts = {
    [ContractMapper.ClubERC20Factory]: {
      syndicateContract: clubERC20Factory,
      estimateGas: () => {
        if (!clubERC20Factory) return;
        clubERC20Factory.getEstimateGas(account, setGasUnits);
      }
    },
    [ContractMapper.DistributionsERC20]: {
      syndicateContract: distributionsERC20,
      estimateGas: () => {
        if (!distributionsERC20) return;
        distributionsERC20.getEstimateGasDistributeERC20(account, setGasUnits);
      }
    },
    [ContractMapper.DistributionsETH]: {
      syndicateContract: distributionsETH,
      estimateGas: () => {
        if (!distributionsETH) return;
        distributionsETH.getEstimateGasDistributeETH(account, setGasUnits);
      }
    }
  };

  const processBaseFee = async (result) => {
    const baseFee = result.result;
    const baseFeeInDecimal = parseInt(baseFee, 16);
    setGasBaseFee(baseFeeInDecimal);
  };

  const fetchGasUnitAndBaseFee = useCallback(async () => {
    await Promise.all([
      !account ? setGasUnits(380000) : contracts[contract].estimateGas(),
      axios
        .get(
          `${activeNetwork.blockExplorer.api}/api?module=proxy&action=eth_gasPrice`
        )
        .then((res) => processBaseFee(res.data))
        .catch(() => 0),
      withFiatCurrency &&
        getNativeTokenPrice(activeNetwork.chainId)
          .then((res) => setNativeTokenPrice(res))
          .catch(() => 0)
    ]);
  }, [account, contracts[contract].syndicateContract]);

  useEffect(() => {
    if (activeNetwork.chainId) {
      void fetchGasUnitAndBaseFee();
    }
  }, [fetchGasUnitAndBaseFee, activeNetwork.chainId]);

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

  useEffect(() => {
    if (withFiatCurrency && nativeTokenPrice) {
      setFiatAmount((gas * nativeTokenPrice).toFixed(2));
    }
  }, [gas, nativeTokenPrice]);

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

        <span className="mr-3 text-blue space-x-2">
          <span>
            {gas
              ? `${gas.toFixed(6)} ${activeNetwork.nativeCurrency.symbol}`
              : `- ${activeNetwork.nativeCurrency.symbol}`}
          </span>
          {withFiatCurrency && fiatAmount && (
            <span>
              (~
              {Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
              }).format(+fiatAmount)}
              )
            </span>
          )}
        </span>
      </span>
    </button>
  );
};

export default EstimateGas;
