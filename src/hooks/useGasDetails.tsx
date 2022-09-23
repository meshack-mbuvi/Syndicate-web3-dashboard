import { useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { AppState } from '@/state';
import { ICollectiveParams } from '@/ClubERC20Factory/ERC721CollectiveFactory';
import { ClubMixinParams } from '@/ClubERC20Factory/ERC20ClubFactory';
import { getNativeTokenPrice } from '@/utils/api/transactions';
import { getWeiAmount } from '@/utils/conversions';
import moment from 'moment';
import { getEthGasPrice } from '@/utils/api';
import { EditRowIndex } from '@/state/collectiveDetails/types';
import BigNumber from 'bignumber.js';

export enum ContractMapper {
  ClubERC20Factory,
  ERC20ClubFactory,
  ERC721CollectiveFactory,
  MintPolicy,
  OwnerMintModule,
  EthPriceMintModule,
  FixedRenderer,
  MaxPerMemberERC721,
  TimeRequirements,
  MaxTotalSupplyERC721,
  ERC721Collective,
  EthPriceMintModuleMint,
  MaxMemberCountMixin,
  MaxTotalSupplyMixin,
  TokenGatedMixin,
  CloseClubPostMint,
  DistributionsERC20
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
        erc20ClubFactory,
        erc721CollectiveFactory,
        policyMintERC20,
        OwnerMintModule,
        ethPriceMintModule,
        fixedRenderer,
        maxPerMemberERC721,
        timeRequirements,
        maxTotalSupplyERC721,
        erc721Collective,
        maxMemberCountMixin,
        maxTotalSupplyMixin,
        tokenGatedMixin,
        distributionsERC20
      }
    },
    collectiveDetailsReducer: { activeRow }
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
    [ContractMapper.ERC20ClubFactory]: {
      syndicateContract: erc20ClubFactory,
      estimateGas: () => {
        if (!erc20ClubFactory) return;
        erc20ClubFactory.getEstimateGas(
          account,
          args.clubParams as ClubMixinParams,
          setGasUnits
        );
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
        if (
          !policyMintERC20 ||
          !args.clubAddress ||
          !args.maxTotalSupply ||
          !+args.maxMemberCount
        )
          return;

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
        if (
          !OwnerMintModule ||
          !args.clubAddress ||
          !args.memberAddress ||
          !args.amountToMint
        )
          return;
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
        if (!fixedRenderer || !args.collectiveAddress || !args.metadataCid)
          return;
        fixedRenderer.getEstimateGas(
          account,
          args.collectiveAddress,
          args.metadataCid,
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
        if (!timeRequirements) return;
        if (!args.collectiveAddress && !args.clubAddress) return;

        const token = args.collectiveAddress || args.clubAddress;
        if (activeRow === EditRowIndex.CloseTimeWindow) {
          timeRequirements.getEstimateGasCloseTimeWindow(
            account,
            token,
            setGasUnits
          );
        } else {
          if (!args.collectiveMintEndTime && !args.clubMintEndTime) return;
          const mintEndTime = args.collectiveAddress
            ? args.collectiveMintEndTime
            : args.clubMintEndTime;
          timeRequirements.getEstimateGas(
            account,
            token,
            0,
            mintEndTime,
            setGasUnits
          );
        }
      }
    },
    [ContractMapper.MaxTotalSupplyERC721]: {
      syndicateContract: maxTotalSupplyERC721,
      estimateGas: () => {
        if (
          !maxTotalSupplyERC721 ||
          !args.collectiveAddress ||
          !args.maxTotalSupply
        )
          return;
        maxTotalSupplyERC721.getEstimateGas(
          account,
          args.collectiveAddress,
          args.maxTotalSupply,
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
    },
    [ContractMapper.MaxMemberCountMixin]: {
      syndicateContract: maxMemberCountMixin,
      estimateGas: () => {
        if (
          !maxMemberCountMixin ||
          !args.clubAddress ||
          !args.maxNumberOfMembers
        )
          return;
        maxMemberCountMixin.getEstimateGas(
          account,
          args.clubAddress,
          args.maxNumberOfMembers,
          setGasUnits
        );
      }
    },
    [ContractMapper.MaxTotalSupplyMixin]: {
      syndicateContract: maxTotalSupplyMixin,
      estimateGas: () => {
        if (!maxTotalSupplyMixin || !args.clubAddress || !args.totalSupply)
          return;
        maxTotalSupplyMixin.getEstimateGas(
          account,
          args.clubAddress,
          getWeiAmount(
            web3,
            new BigNumber(args.totalSupply).toFixed(),
            18,
            true
          ),
          setGasUnits
        );
      }
    },
    [ContractMapper.TokenGatedMixin]: {
      syndicateContract: tokenGatedMixin,
      estimateGas: () => {
        if (
          !tokenGatedMixin ||
          !args.clubAddress ||
          !args.logicOperator ||
          !args.tokens.length ||
          !args.balances.length
        )
          return;
        tokenGatedMixin.getEstimateGas(
          account,
          args.clubAddress,
          args.logicOperator,
          args.tokens,
          args.balances,
          setGasUnits
        );
      }
    },
    [ContractMapper.CloseClubPostMint]: {
      syndicateContract: erc721Collective,
      estimateGas: () => {
        if (!timeRequirements || !args.clubAddress) return;
        timeRequirements.getEstimateGasCloseTimeWindow(
          account,
          args.clubAddress,
          setGasUnits
        );
      }
    },
    [ContractMapper.DistributionsERC20]: {
      syndicateContract: distributionsERC20,
      estimateGas: () => {
        if (
          !distributionsERC20 ||
          !args.clubAddress ||
          !args.distributionERC20Address ||
          !args.members ||
          !args.numSelectedTokens
        )
          return;
        distributionsERC20.getEstimateGasDistributeERC20(
          account,
          args.numSelectedTokens,
          args.clubAddress,
          args.distributionERC20Address,
          args.totalDistributionAmount,
          args.members,
          args.batchIdentifier,
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
      getEthGasPrice(activeNetwork.blockExplorer.api, activeNetwork.chainId)
        .then((res) => processBaseFee(res.data))
        .catch(() => 0),
      withFiatCurrency &&
        getNativeTokenPrice(activeNetwork.chainId)
          .then((res) => setNativeTokenPrice(res))
          .catch(() => 0)
    ]);
  }, [account, contracts[contract]?.syndicateContract, activeNetwork, args]);

  useEffect(() => {
    if (skipQuery) return;
    if (activeNetwork.chainId) {
      void fetchGasUnitAndBaseFee();
    }
  }, [activeNetwork.chainId, skipQuery, args]);

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
