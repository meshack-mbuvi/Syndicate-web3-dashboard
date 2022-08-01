import { getNativeTokenPrice } from '@/utils/api/transactions';
import { AppState } from '@/state';
import { getWeiAmount } from '@/utils/conversions';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { ICollectiveParams } from '@/ClubERC20Factory/ERC721CollectiveFactory';

export enum ContractMapper {
  ClubERC20Factory,
  ERC721CollectiveFactory,
  MintPolicy,
  OwnerMintModule
}

interface Props {
  contract: ContractMapper;
  customClasses?: string;
  withFiatCurrency?: boolean;
  args?: Record<string, any>;
  skipQuery?: boolean;
}

const EstimateGas: React.FC<Props> = ({
  contract,
  customClasses = '',
  withFiatCurrency = false,
  args = {},
  skipQuery = false
}) => {
  const {
    web3Reducer: {
      web3: { account, activeNetwork, web3 }
    },
    initializeContractsReducer: {
      syndicateContracts: {
        clubERC20Factory,
        erc721CollectiveFactory,
        policyMintERC20,
        OwnerMintModule
      }
    }
  } = useSelector((state: AppState) => state);

  const [gas, setGas] = useState(0);
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
    [ContractMapper.ERC721CollectiveFactory]: {
      syndicateContract: erc721CollectiveFactory,
      estimateGas: () => {
        if (!erc721CollectiveFactory) return;
        // convert price to wei
        args.collectiveParams.ethPrice = web3.utils.toWei(
          String(args.collectiveParams.ethPrice)
        );

        erc721CollectiveFactory.getEstimateGas(
          account,
          args.collectiveParams as ICollectiveParams,
          setGasUnits
        );
      }
    },
    [ContractMapper.MintPolicy]: {
      syndicateContract: policyMintERC20,
      estimateGas: () => {
        if (!policyMintERC20) return;

        const now = new Date();
        const startTime = moment(now).valueOf();
        const endTime = moment(moment(now).valueOf()).add(1, 'days').valueOf();

        policyMintERC20.getEstimateGas(
          account,
          args.clubAddress,
          startTime,
          endTime,
          args.maxMemberCount,
          web3.utils.toWei(args.maxTotalSupply),
          setGasUnits
        );
      }
    },
    [ContractMapper.OwnerMintModule]: {
      syndicateContract: OwnerMintModule,
      estimateGas: () => {
        if (!OwnerMintModule) return;
        OwnerMintModule.getEstimateGas(
          account,
          args.clubAddress,
          args.memberAddress,
          web3.utils.toWei(args.amountToMint),
          setGasUnits
        );
      }
    }
  };

  const processBaseFee = async (result) => {
    if (result.status === '0') return;
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
  }, [
    activeNetwork.chainId,
    account,
    contracts[contract].syndicateContract,
    args
  ]);

  useEffect(() => {
    if (skipQuery) return;
    if (activeNetwork.chainId) {
      void fetchGasUnitAndBaseFee();
    }
  }, [activeNetwork.chainId, skipQuery]);

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
