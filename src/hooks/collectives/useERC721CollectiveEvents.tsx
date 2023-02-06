import { CollectiveActivityType } from '@/components/collectives/activity';
import { GetERC721MemberEvents } from '@/graphql/subgraph_queries';
import { SUPPORTED_GRAPHS } from '@/Networks/backendLinks';
import { AppState } from '@/state';
import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useDemoMode } from '../useDemoMode';

export interface IEvent {
  activityType: CollectiveActivityType;
  profile: {
    address: string;
  };
  timeStamp: string;
}

export interface ICollectiveEventsResponse {
  collectiveEvents: IEvent[];
  collectiveEventsLoading: boolean;
}

const useERC721CollectiveEvents = (): ICollectiveEventsResponse => {
  const {
    web3Reducer: {
      web3: { account, activeNetwork }
    }
  } = useSelector((state: AppState) => state);

  const router = useRouter();
  const {
    query: { collectiveAddress }
  } = router;

  const isDemoMode = useDemoMode();

  // get collective member joined events
  const { loading, data } = useQuery(GetERC721MemberEvents, {
    variables: {
      where: {
        collective_contains_nocase: collectiveAddress
      }
    },
    skip:
      !collectiveAddress || !account || !activeNetwork.chainId || isDemoMode,
    context: {
      clientName: SUPPORTED_GRAPHS.THE_GRAPH,
      chainId: activeNetwork.chainId
    }
  });

  const collectiveEvents = useMemo(() => {
    if (loading) {
      return [];
    }

    if (data && data.mintERC721S.length) {
      return data.mintERC721S.map((event: any) => {
        const { to, createdAt } = event;
        return {
          activityType: CollectiveActivityType.RECEIVED,
          profile: {
            address: to
          },
          timeStamp: createdAt
        };
      });
    }
  }, [loading, data]);

  return {
    collectiveEvents,
    collectiveEventsLoading: loading
  };
};

export default useERC721CollectiveEvents;
