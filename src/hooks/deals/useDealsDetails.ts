import { SUPPORTED_GRAPHS } from '@/Networks/backendLinks';
import { AppState } from '@/state';
import { getFirstOrString } from '@/utils/stringUtils';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  RequirementType,
  useDealDetailsQuery
} from '../data-fetching/thegraph/generated-types';
import { useDemoMode } from '../useDemoMode';
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

  const dealAddress = getFirstOrString(router.query.dealAddress) || '';

  const isDemoMode = useDemoMode();
  const { isCorrectDealNetwork, isLoadingNetwork } = useVerifyDealNetwork(
    dealAddress as string
  );
  let dealDetails = emptyDeal;
  let dealNotFound = false;

  // get deal details
  const { loading, data, startPolling, stopPolling } = useDealDetailsQuery({
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
      deal.mixins?.map((mixin) => {
        if (mixin.requirementType === RequirementType.TimeWindow) {
          dealEndTime = mixin.endTime;
          dealStartTime = mixin.startTime;
        }

        if (mixin.requirementType === RequirementType.MinPerMember) {
          minPerMember = mixin.minPerMember;
        }
      });
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
