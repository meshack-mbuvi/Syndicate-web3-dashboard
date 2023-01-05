import { GetDealDetails } from '@/graphql/queries';
import { AppState } from '@/state';
import { useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { useDemoMode } from '../useDemoMode';
import { SUPPORTED_GRAPHS } from '@/Networks/backendLinks';
import { Deal, MixinModuleRequirementType } from './types';

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
  //   dealNetwork: boolean;
}

const useDealsDetails = (): IDealDetailsResponse => {
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

  const [dealDetails, setDealDetails] = useState<IDealDetails>(emptyDeal);
  const [dealNotFound, setDealNotFound] = useState(false);

  // get deal details
  const { loading, data } = useQuery<{ deal: Deal }>(GetDealDetails, {
    variables: {
      dealId: dealAddress
    },
    skip: !dealAddress || !activeNetwork.chainId || isDemoMode,
    context: {
      clientName: SUPPORTED_GRAPHS.THE_GRAPH,
      chainId: activeNetwork.chainId
    }
  });

  // process deal details
  useEffect(() => {
    if (loading) {
      return;
    }
    let isComponentMounted = true;

    // TODO [WINGZ]: should totalCommitted and goal be converted?
    if (isComponentMounted) {
      const deal = data?.deal;
      if (deal) {
        let dealStartTime = '';
        let dealEndTime = '';
        let minPerMember = '';
        deal.mixins.map((mixin) => {
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
        });
        setDealDetails({
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
        });
      } else {
        setDealDetails(emptyDeal);
        setDealNotFound(true);
      }
    }
    return () => {
      isComponentMounted = false;
    };
  }, [loading, data, activeNetwork?.chainId]);

  return {
    dealDetails,
    dealDetailsLoading: !dealNotFound && dealDetails.dealName === '',
    dealNotFound
    // correctDealNetwork
  };
};

export default useDealsDetails;
