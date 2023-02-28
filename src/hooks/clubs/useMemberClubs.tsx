import { processClubERC20Tokens } from '@/hooks/clubs/utils/helpers';
import { CustomSyndicateDao, IMemberResponse } from '@/hooks/clubs/utils/types';
import { useGetClubsHaveInvestedInQuery } from '@/hooks/data-fetching/thegraph/generated-types';
import { SUPPORTED_GRAPHS } from '@/Networks/backendLinks';
import { AppState } from '@/state';
import { Status } from '@/state/wallet/types';
import { useApolloClient } from '@apollo/client';
import { isEmpty } from 'lodash';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

const useMemberClubs = (): {
  memberClubs: Partial<CustomSyndicateDao>[];
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
  const [memberClubs, setMemberClubs] =
    useState<Partial<CustomSyndicateDao>[]>();

  const apolloClient = useApolloClient();
  const abortController = new AbortController();

  const { loading, data, error, refetch } = useGetClubsHaveInvestedInQuery({
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
      status !== Status.CONNECTED ||
      activeNetwork.chainId === 0
  });

  useEffect(() => {
    if (!error && activeNetwork.chainId !== 0) {
      void refetch({
        where: { memberAddress: accountAddress }
      });
    }
    return () => {
      abortController.abort();
    };
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

    const clubTokens: Partial<CustomSyndicateDao>[] = [];

    data?.members.map((member: IMemberResponse) => {
      member?.syndicateDAOs?.map(
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
        }) => {
          clubTokens.push({
            depositAmount,
            contractAddress,
            ownerAddress,
            members,
            totalSupply: totalSupply as string,
            totalDeposits: totalDeposits as string,
            maxTotalSupply: maxTotalSupply as string,
            endTime: endTime as string,
            startTime: startTime as string
          });
        }
      );
    });

    processClubERC20Tokens(
      account,
      clubTokens,
      activeNetwork,
      syndicateContracts,
      apolloClient,
      abortController.signal
    )
      .then((tokens) => setMemberClubs(tokens))
      .catch(() => setMemberClubs([]));
  }, [loading, data]);

  return {
    memberClubs: memberClubs || [],
    memberClubsLoading: loading || (memberClubs?.length == 0 && data == null)
  };
};

export default useMemberClubs;
