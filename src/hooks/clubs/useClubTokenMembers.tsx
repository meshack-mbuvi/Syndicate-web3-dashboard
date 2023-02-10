import {
  GetClubMembersQuery,
  MemberMinted,
  useGetClubMembersQuery
} from '@/hooks/data-fetching/thegraph/generated-types';
import { SUPPORTED_GRAPHS } from '@/Networks/backendLinks';
import { AppState } from '@/state';
import { getWeiAmount } from '@/utils/conversions';
import { mockClubMembers, mockDataMintEvents } from '@/utils/mockdata';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDemoMode } from '../useDemoMode';
import { getAssets } from '../useFetchEnsAssets';
import { clubMember } from './utils/types';

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

  const { loading, data } = useGetClubMembersQuery({
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

  const processMembers = async (
    syndicateData: Partial<GetClubMembersQuery>
  ): Promise<void> => {
    const syndicate = syndicateData?.syndicateDAOs?.[0];

    if (!syndicate || !syndicate?.members || !syndicate.members.length) {
      return;
    }

    const mintEvents: { [x: string]: number } = {};

    syndicateData?.syndicateEvents?.forEach((event) => {
      const { memberAddress, createdAt } = event as MemberMinted;
      if (memberAddress && !(memberAddress in mintEvents)) {
        mintEvents[`${memberAddress}`] = +createdAt;
      }
    });

    const clubTotalSupply: number = +getWeiAmount(
      syndicate.totalSupply,
      tokenDecimals,
      false
    );

    const _clubMembers = await Promise.all(
      syndicate.members.map(async ({ depositAmount, tokens, member }) => {
        const memberAddress = member?.memberAddress;
        const clubTokens: number =
          +getWeiAmount(tokens as string, tokenDecimals, false) || 0;

        let data;
        try {
          if (ethersProvider && memberAddress) {
            data = await getAssets(memberAddress, ethersProvider);
          }
        } catch (error) {
          data = null;
        }

        return {
          memberAddress,
          symbol,
          clubTokens,
          totalSupply,
          createdAt: memberAddress ? mintEvents[memberAddress] : 0,
          ensName: data?.name || '',
          avatar: data?.avatar || '',
          ownershipShare: (100 * clubTokens) / clubTotalSupply,
          depositAmount: getWeiAmount(
            depositAmount,
            depositTokenDecimals,
            false
          )
        };
      })
    );

    setClubMembers(_clubMembers);
    setIsFetchingMembers(false);
  };

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

      void processMembers(data);
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
