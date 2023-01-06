import { CLUB_TOKEN_MEMBERS } from '@/graphql/queries';
import { SUPPORTED_GRAPHS } from '@/Networks/backendLinks';
import { AppState } from '@/state';
import { getWeiAmount } from '@/utils/conversions';
import { mockClubMembers, mockDataMintEvents } from '@/utils/mockdata';
import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDemoMode } from '../useDemoMode';
import { getAssets } from '../useFetchEnsAssets';

type clubMember = {
  depositAmount: string;
  memberAddress: string;
  clubTokens: string;
  ownershipShare: number;
  symbol: string;
  totalSupply: string;
  ensName: string;
  avatar: string;
  createdAt: string;
};

const useClubTokenMembers = (): {
  clubMembers: clubMember[];
  isFetchingMembers: boolean;
} => {
  const {
    web3Reducer: { web3: web3Instance },
    erc20TokenSliceReducer: {
      erc20Token: { symbol, tokenDecimals, totalSupply },
      depositDetails: { depositTokenDecimals, nativeDepositToken }
    }
  } = useSelector((state: AppState) => state);

  const [clubMembers, setClubMembers] = useState<clubMember[]>([]);
  const [isFetchingMembers, setIsFetchingMembers] = useState(true);

  const router = useRouter();
  const { clubAddress } = router.query;
  const isDemoMode = useDemoMode();

  const { account, activeNetwork, ethersProvider } = web3Instance;

  // Retrieve syndicates that I manage
  const { loading, refetch, data } = useQuery(CLUB_TOKEN_MEMBERS, {
    variables: {
      where: {
        contractAddress: clubAddress?.toString().toLowerCase()
      },
      where2: {
        commonId: clubAddress?.toString().toLowerCase()
      }
    },
    context: {
      clientName: SUPPORTED_GRAPHS.THE_GRAPH,
      chainId: activeNetwork.chainId
    },
    skip: !clubAddress || isDemoMode || !activeNetwork.chainId
  });

  const processMembers = async (syndicateData: {
    syndicateDAOs: any[];
    syndicateEvents: { memberAddress: string; createdAt: string }[];
  }): Promise<void> => {
    const syndicate = syndicateData?.syndicateDAOs?.[0];
    if (!syndicate || !syndicate?.members || !syndicate.members.length) {
      return;
    }

    const mintEvents: { [x: string]: number } = {};

    syndicateData?.syndicateEvents?.forEach(
      ({
        memberAddress,
        createdAt
      }: {
        memberAddress: string;
        createdAt: string;
      }) => {
        if (memberAddress && !(memberAddress in mintEvents)) {
          mintEvents[`${memberAddress}`] = +createdAt;
        }
      }
    );

    const clubTotalSupply: number = +getWeiAmount(
      syndicate.totalSupply,
      tokenDecimals,
      false
    );

    const _clubMembers = await Promise.all(
      syndicate.members.map(
        async ({
          depositAmount,
          tokens,
          member: { memberAddress }
        }: {
          depositAmount: string;
          tokens: string;
          member: { memberAddress: string };
        }) => {
          const clubTokens: number =
            getWeiAmount(tokens, tokenDecimals, false) || 0;

          let data;
          try {
            if (ethersProvider) {
              data = await getAssets(memberAddress, ethersProvider);
            }
          } catch (error) {
            data = null;
          }

          return {
            memberAddress,
            symbol,
            clubTokens,
            createdAt: mintEvents[memberAddress] || 0,
            ensName: data?.name || '',
            avatar: data?.avatar || '',
            ownershipShare: (100 * clubTokens) / clubTotalSupply,
            totalSupply: totalSupply,
            depositAmount: getWeiAmount(
              depositAmount,
              depositTokenDecimals,
              false
            )
          };
        }
      )
    );

    setClubMembers(_clubMembers);
    setIsFetchingMembers(false);
  };

  useEffect(() => {
    if (router.isReady && activeNetwork.chainId) {
      refetch();
    }
  }, [
    router.isReady,
    account,
    activeNetwork.chainId,
    totalSupply,
    nativeDepositToken
  ]);

  useEffect(() => {
    if (isDemoMode) {
      void processMembers({
        syndicateDAOs: mockClubMembers,
        syndicateEvents: mockDataMintEvents
      });
      setIsFetchingMembers(false);
    }

    if (loading) return;

    if (data?.syndicateDAOs?.[0]?.members?.length) {
      setClubMembers([]);

      processMembers(data);
    } else {
      setClubMembers([]);
      setIsFetchingMembers(false);
    }
  }, [
    JSON.stringify(data?.syndicateDAOs?.[0]),
    clubAddress,
    account,
    nativeDepositToken,
    loading
  ]);

  return { clubMembers, isFetchingMembers };
};

export default useClubTokenMembers;
