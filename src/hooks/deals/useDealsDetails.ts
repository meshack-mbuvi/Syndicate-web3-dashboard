import { GetDealDetails } from '@/graphql/subgraph_queries';
import { SUPPORTED_GRAPHS } from '@/Networks/backendLinks';
import { AppState } from '@/state';
import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDemoMode } from '../useDemoMode';
import { Deal, MixinModuleRequirementType } from './types';
import useVerifyDealNetwork from './useVerifyDealNetwork';

export interface IDealDetails {
  dealName: string;
  dealDescription: string;
  ownerAddress: string;
  dealTokenAddress: string;
  dealTokenSymbol: string;
  dealStartTime: string;
  dealEndTime: string;
  depositToken: string;
  dealDestination: string;
  goal: string;
  minCommitAmount: string;
  isClosed: boolean;
  totalCommitments: string;
  totalCommitted: string;
  createdAt: string;
  minPerMember: string;
}

const emptyDeal: IDealDetails = {
  dealName: '',
  dealDescription: '',
  ownerAddress: '',
  dealTokenAddress: '',
  dealTokenSymbol: '',
  dealStartTime: '',
  dealEndTime: '',
  depositToken: '',
  dealDestination: '',
  goal: '',
  minCommitAmount: '',
  isClosed: false,
  totalCommitments: '',
  totalCommitted: '',
  createdAt: '',
  minPerMember: ''
};

export interface IDealDetailsResponse {
  dealDetails: IDealDetails;
  dealDetailsLoading: boolean;
  dealNotFound: boolean;
  isCorrectDealNetwork: boolean;
}

const useDealsDetails = (overridePoll: boolean): IDealDetailsResponse => {
  const {
    web3Reducer: {
      web3: { activeNetwork }
    }
  } = useSelector((state: AppState) => state);

  const router = useRouter();
  const {
    query: { dealAddress }
  } = router;

  const isDemoMode = useDemoMode();
  const { isCorrectDealNetwork, isLoadingNetwork } = useVerifyDealNetwork(
    dealAddress as string
  );
  let dealDetails = emptyDeal;
  let dealNotFound = false;

  // get deal details
  const { loading, data, startPolling, stopPolling, refetch } = useQuery<{
    deal: Deal;
  }>(GetDealDetails, {
    variables: {
      dealId: dealAddress
    },
    skip:
      !dealAddress || !activeNetwork.chainId || !router.isReady || isDemoMode,
    context: {
      clientName: SUPPORTED_GRAPHS.THE_GRAPH,
      chainId: activeNetwork.chainId
    }
  });

  useEffect(() => {
    void refetch({
      where: { dealId: dealAddress }
    });
  }, [activeNetwork.chainId, dealAddress, isCorrectDealNetwork]);

  useEffect(() => {
    if (overridePoll) {
      startPolling(2000);
    } else {
      stopPolling;
    }
  }, [overridePoll, activeNetwork.chainId]);

  // process deal details
  if (!loading) {
    const deal = data?.deal;
    if (deal) {
      let dealStartTime = '';
      let dealEndTime = '';
      let minPerMember = '';
      deal.mixins?.map(
        (mixin: {
          requirementType: MixinModuleRequirementType;
          endTime: string;
          startTime: string;
          minPerMember: string;
        }) => {
          if (
            mixin.requirementType === MixinModuleRequirementType.TIME_WINDOW
          ) {
            dealEndTime = mixin.endTime;
            dealStartTime = mixin.startTime;
          }

          if (
            mixin.requirementType === MixinModuleRequirementType.MIN_PER_MEMBER
          ) {
            minPerMember = mixin.minPerMember;
          }
        }
      );
      dealDetails = {
        dealName: deal.dealToken.name,
        dealDescription: '', // When we add descriptions after v0, pass it in here
        dealStartTime: dealStartTime,
        dealEndTime: dealEndTime,
        ownerAddress: deal.ownerAddress,
        dealTokenAddress: deal.dealToken.contractAddress,
        dealTokenSymbol: deal.dealToken.symbol,
        depositToken: deal.depositToken,
        dealDestination: deal.destinationAddress,
        goal: deal.goal,
        minCommitAmount: minPerMember ?? '',
        isClosed: deal.closed,
        totalCommitments: deal.numCommits,
        totalCommitted: deal.totalCommitted,
        createdAt: deal.dealToken.createdAt,
        minPerMember: minPerMember
      };
    } else {
      dealNotFound = true;
      dealDetails = emptyDeal;
    }
  }

  return {
    dealDetails,
    dealDetailsLoading:
      (!dealNotFound && dealDetails.dealName === '') ||
      overridePoll ||
      isLoadingNetwork,
    dealNotFound,
    isCorrectDealNetwork
  };
};

export default useDealsDetails;
