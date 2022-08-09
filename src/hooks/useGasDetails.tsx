import { useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { AppState } from '@/state';
import { ICollectiveParams } from '@/ClubERC20Factory/ERC721CollectiveFactory';
import { getNativeTokenPrice } from '@/utils/api/transactions';
import { getWeiAmount } from '@/utils/conversions';
import moment from 'moment';
import { getEthGasPrice } from '@/utils/api';

export enum ContractMapper {
  ClubERC20Factory,
  ERC721CollectiveFactory,
  MintPolicy,
  OwnerMintModule,
  EthPriceMintModule,
  FixedRenderer,
  MaxPerMemberERC721,
  TimeRequirements,
  ERC721Collective,
  EthPriceMintModuleMint
}

interface IProps {
  contract: ContractMapper;
  withFiatCurrency?: boolean;
  args?: Record<string, any>;
  skipQuery?: boolean;
}

const useGasDetails: (props: IProps) => {
  gas: number;
  fiatAmount: string;
  nativeTokenPrice: number;
} = ({ contract, withFiatCurrency = false, args = {}, skipQuery = false }) => {
  const {
    web3Reducer: {
      web3: { account, activeNetwork, web3 }
    },
    initializeContractsReducer: {
      syndicateContracts: {
        clubERC20Factory,
        erc721CollectiveFactory,
        policyMintERC20,
        OwnerMintModule,
        ethPriceMintModule,
        fixedRenderer,
        maxPerMemberERC721,
        timeRequirements,
        erc721Collective
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
    },
    [ContractMapper.EthPriceMintModule]: {
      syndicateContract: ethPriceMintModule,
      estimateGas: () => {
        if (!ethPriceMintModule || !args.collectiveAddress || !args.mintPrice)
          return;
        // convert price to wei
        args.mintPrice = web3.utils.toWei(String(args.mintPrice));
        ethPriceMintModule.getEstimateGas(
          account,
          args.collectiveAddress,
          args.mintPrice,
          setGasUnits
        );
      }
    },
    [ContractMapper.FixedRenderer]: {
      syndicateContract: fixedRenderer,
      estimateGas: () => {
        if (!fixedRenderer || !args.collectiveAddress || !args.ipfsHash) return;
        fixedRenderer.getEstimateGas(
          account,
          args.collectiveAddress,
          args.ipfsHash,
          setGasUnits
        );
      }
    },
    [ContractMapper.MaxPerMemberERC721]: {
      syndicateContract: maxPerMemberERC721,
      estimateGas: () => {
        if (
          !maxPerMemberERC721 ||
          !args.collectiveAddress ||
          !args.maxPerWallet
        )
          return;
        maxPerMemberERC721.getEstimateGas(
          account,
          args.collectiveAddress,
          args.maxPerWallet,
          setGasUnits
        );
      }
    },
    [ContractMapper.TimeRequirements]: {
      syndicateContract: timeRequirements,
      estimateGas: () => {
        if (!timeRequirements || !args.collectiveAddress || !args.mintEndTime)
          return;
        timeRequirements.getEstimateGas(
          account,
          args.collectiveAddress,
          0,
          args.mintEndTime,
          setGasUnits
        );
      }
    },
    [ContractMapper.ERC721Collective]: {
      syndicateContract: erc721Collective,
      estimateGas: () => {
        if (!erc721Collective) return;
        erc721Collective.getEstimateGas(
          account,
          args.collectiveAddress,
          args.isTransferable,
          setGasUnits
        );
      }
    },
    [ContractMapper.EthPriceMintModuleMint]: {
      syndicateContract: ethPriceMintModule,
      estimateGas: () => {
        if (!ethPriceMintModule || !args.priceEth || !args.contractAddress)
          return;
        ethPriceMintModule.getMintEstimateGas(
          args.priceEth,
          args.contractAddress,
          '1', // Hardcode to mint a single token
          account,
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
      !account ? setGasUnits(380000) : contracts[contract]?.estimateGas(),
      getEthGasPrice(activeNetwork.blockExplorer.api)
        .then((res) => processBaseFee(res.data))
        .catch(() => 0),
      withFiatCurrency &&
        getNativeTokenPrice(activeNetwork.chainId)
          .then((res) => setNativeTokenPrice(res))
          .catch(() => 0)
    ]);
  }, [account, contracts[contract]?.syndicateContract, args]);

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

  return { gas, fiatAmount, nativeTokenPrice };
};

export default useGasDetails;
