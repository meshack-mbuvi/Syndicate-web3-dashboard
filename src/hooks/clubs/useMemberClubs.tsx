import { SUPPORTED_GRAPHS } from '@/Networks/backendLinks';
import { AppState } from '@/state';
import { Status } from '@/state/wallet/types';
import { useApolloClient, useQuery } from '@apollo/client';
import { isEmpty } from 'lodash';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  IClubERC20,
  IGraphClubsResponse,
  IMemberResponse
} from '@/hooks/clubs/utils/types';
import { processClubERC20Tokens } from '@/hooks/clubs/utils/helpers';
import { CLUBS_HAVE_INVESTED } from '@/graphql/subgraph_queries';

const useMemberClubs = (): {
  memberClubs: IClubERC20[];
  memberClubsLoading: boolean;
} => {
  const {
    initializeContractsReducer: { syndicateContracts },
    web3Reducer: {
      web3: { account, activeNetwork, web3, status }
    }
  } = useSelector((state: AppState) => state);

  const router = useRouter();
  const accountAddress = useMemo(() => account.toLocaleLowerCase(), [account]);
  const [memberClubs, setMemberClubs] = useState<IClubERC20[]>([]);

  const apolloClient = useApolloClient();

  const { loading, data, refetch } = useQuery(CLUBS_HAVE_INVESTED, {
    variables: {
      where: {
        memberAddress: accountAddress
      }
    },
    context: {
      clientName: SUPPORTED_GRAPHS.THE_GRAPH,
      chainId: activeNetwork.chainId
    },
    // Avoid unnecessary calls when account is not defined
    skip:
      !accountAddress ||
      !router.isReady ||
      !activeNetwork.chainId ||
      status !== Status.CONNECTED
  });

  useEffect(() => {
    void refetch({
      where: {
        memberAddress: accountAddress
      }
    });
  }, [activeNetwork.chainId, accountAddress]);

  useEffect(() => {
    if (
      loading ||
      status == Status.DISCONNECTED ||
      !accountAddress ||
      !data ||
      !accountAddress ||
      isEmpty(web3)
    ) {
      return;
    }

    const clubTokens: IGraphClubsResponse[] = [];

    data?.members.map((member: IMemberResponse) => {
      member?.syndicateDAOs.map(
        ({
          depositAmount,
          syndicateDAO: {
            contractAddress,
            ownerAddress,
            totalSupply,
            totalDeposits,
            maxTotalSupply,
            members,
            endTime,
            startTime
          }
        }: {
          depositAmount: string;
          syndicateDAO: IGraphClubsResponse;
        }) => {
          clubTokens.push({
            depositAmount,
            contractAddress,
            ownerAddress,
            totalSupply,
            totalDeposits,
            maxTotalSupply,
            members,
            endTime,
            startTime
          });
        }
      );
    });

    void processClubERC20Tokens(
      account,
      clubTokens,
      activeNetwork,
      web3,
      syndicateContracts,
      apolloClient
    ).then((tokens) => setMemberClubs(tokens));
  }, [loading, data]);

  return {
    memberClubs,
    memberClubsLoading: loading || (memberClubs.length == 0 && data == null)
  };
};

export default useMemberClubs;
