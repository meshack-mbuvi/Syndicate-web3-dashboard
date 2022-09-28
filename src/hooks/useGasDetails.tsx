import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { AppState } from '@/state';
import { ICollectiveParams } from '@/ClubERC20Factory/ERC721CollectiveFactory';
import { ClubMixinParams } from '@/ClubERC20Factory/ERC20ClubFactory';
import { GAS_RATE } from '@/graphql/queries';
import { useQuery } from '@apollo/client';
import { getWeiAmount } from '@/utils/conversions';
import moment from 'moment';
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

// @ts-expect-error TS(2322): Type 'undefined' is not assignable to type 'number... Remove this comment to see the full error message
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
        // @ts-expect-error TS(2345): Argument of type 'Dispatch<SetStateAction<number>>' is not assignable t... Remove this comment to see the full error message
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
          // @ts-expect-error TS(2345): Argument of type 'Dispatch<SetStateAction<number>>' is not assignable t... Remove this comment to see the full error message
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
          // @ts-expect-error TS(2345): Argument of type 'Dispatch<SetStateAction<number>>' is not assignable t... Remove this comment to see the full error message
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
          // @ts-expect-error TS(2345): Argument of type 'Dispatch<SetStateAction<number>>' is not assignable t... Remove this comment to see the full error message
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
          // @ts-expect-error TS(2345): Argument of type 'Dispatch<SetStateAction<number>>' is not assignable t... Remove this comment to see the full error message
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
          // @ts-expect-error TS(2345): Argument of type 'Dispatch<SetStateAction<number>>' is not assignable t... Remove this comment to see the full error message
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
          // @ts-expect-error TS(2345): Argument of type 'Dispatch<SetStateAction<number>>' is not assignable t... Remove this comment to see the full error message
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
          // @ts-expect-error TS(2345): Argument of type 'Dispatch<SetStateAction<number>>' is not assignable t... Remove this comment to see the full error message
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
            // @ts-expect-error TS(2345): Argument of type 'Dispatch<SetStateAction<number>>' is not assignable t... Remove this comment to see the full error message
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
            // @ts-expect-error TS(2345): Argument of type 'Dispatch<SetStateAction<number>>' is not assignable t... Remove this comment to see the full error message
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
          // @ts-expect-error TS(2345): Argument of type 'Dispatch<SetStateAction<number>>' is not assignable t... Remove this comment to see the full error message
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
          // @ts-expect-error TS(2345): Argument of type 'Dispatch<SetStateAction<number>>' is not assignable t... Remove this comment to see the full error message
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
          // @ts-expect-error TS(2345): Argument of type 'Dispatch<SetStateAction<number>>' is not assignable t... Remove this comment to see the full error message
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
          // @ts-expect-error TS(2345): Argument of type 'Dispatch<SetStateAction<number>>' is not assignable t... Remove this comment to see the full error message
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
          // @ts-expect-error TS(2345): Argument of type 'Dispatch<SetStateAction<number>>' is not assignable t... Remove this comment to see the full error message
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
          // @ts-expect-error TS(2345): Argument of type 'Dispatch<SetStateAction<number>>' is not assignable t... Remove this comment to see the full error message
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
          // @ts-expect-error TS(2345): Argument of type 'Dispatch<SetStateAction<number>>' is not assignable t... Remove this comment to see the full error message
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

  // GET GAS DETAILS
  const { loading, data } = useQuery(GAS_RATE, {
    variables: {
      chainId: activeNetwork.chainId
    },
    context: { clientName: 'backend', chainId: activeNetwork.chainId },
    skip: skipQuery || !activeNetwork.chainId
  });

  useEffect(() => {
    if (skipQuery) return;
    if (activeNetwork.chainId && account) {
      contracts[contract]?.estimateGas();
    } else {
      setGasUnits(380000);
    }
  }, [activeNetwork.chainId, skipQuery, account, args]);

  useEffect(() => {
    if (loading || !data) return;
    setGasBaseFee(parseInt(data.gas.unitPrice));
    setNativeTokenPrice(parseFloat(data.gas.nativeToken.price.usd));
  }, [loading, data]);

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
    if (withFiatCurrency && nativeTokenPrice) {
      setFiatAmount((+estimatedGas * nativeTokenPrice).toFixed(2));
    }
  }, [gasUnits, gasBaseFee]);

  return { gas, fiatAmount, nativeTokenPrice };
};

export default useGasDetails;
