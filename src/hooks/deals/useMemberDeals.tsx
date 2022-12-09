import { GetMemberDeals } from '@/graphql/queries';
import { AppState } from '@/state';
import { Status } from '@/state/wallet/types';
import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { SUPPORTED_GRAPHS } from '@/Networks/backendLinks';

export interface IDealPreview {
  dealName: string;
  status: string;
  totalCommitments: string;
  totalCommited: string;
}

const useMemberDeals = (): {
  memberDeals: IDealPreview[];
  memberDealsLoading: boolean;
} => {
  const {
    web3Reducer: {
      web3: { account, activeNetwork, status }
    }
  } = useSelector((state: AppState) => state);

  const router = useRouter();

  const walletAddress = useMemo(() => account.toLowerCase(), [account]);
  const [memberDeals, setMemberDeals] = useState<IDealPreview[]>([]);

  // retrieve member deals
  const { loading, refetch, data } = useQuery(GetMemberDeals, {
    variables: {
      where: { ownerAddress: walletAddress }
    },
    context: {
      clientName: SUPPORTED_GRAPHS.THE_GRAPH,
      chainId: activeNetwork.chainId
    },
    skip:
      !walletAddress ||
      !router.isReady ||
      !activeNetwork.chainId ||
      status !== Status.CONNECTED ||
      true // TODO: Remove when subgraph is ready
  });

  useEffect(() => {
    // TODO: Remove when subgraph is ready
    setMemberDeals([
      {
        dealName: 'Dummy Deal',
        status: 'OPEN',
        totalCommitments: '3',
        totalCommited: '5000'
      }
    ]);
    return;

    refetch({
      where: { ownerAddress: walletAddress }
    });
  }, [activeNetwork.chainId, walletAddress]);

  useEffect(() => {
    if (loading || !data?.deals) return;

    // TODO: Proccess deals
    // const processedMemberDeals: Promise<IDealPreview>[] = (
    //   data?.deals as IGraphCollectiveResponse[]
    // )
    //   .map(
    //     async ({...}) => {
    //       return {...};
    //     }
    //   )
    //   .filter((deal) => deal !== undefined);

    // void Promise.all<IDealPreview>(processedMemberDeals).then(
    //   (deal: IDealPreview[]) => {
    //     setMemberDeals(deal);
    //   }
    // );
  }, [loading, data]);

  return {
    memberDeals,
    memberDealsLoading: loading || (memberDeals.length == 0 && data != null)
  };
};

export default useMemberDeals;
