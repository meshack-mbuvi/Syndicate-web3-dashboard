import { GetAdminCollectives, GetMemberCollectives } from '@/graphql/queries';
import { AppState } from '@/state';
import {
  setAdminCollectives,
  setMemberCollectives
} from '@/state/collectives/slice';
import { Collective } from '@/state/collectives/types';
import { Status } from '@/state/wallet/types';
import { getWeiAmount } from '@/utils/conversions';
import { useQuery } from '@apollo/client';
import { isEmpty } from 'lodash';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const useCollectives = () => {
  const dispatch = useDispatch();

  const {
    web3Reducer: { web3: web3Instance }
  } = useSelector((state: AppState) => state);

  const router = useRouter();

  const { account, activeNetwork, web3, status } = web3Instance;
  const walletAddress = useMemo(() => account.toLowerCase(), [account]);
  const [isLoading, setIsLoading] = useState(true);

  // Retrieve my collectives
  const { loading, refetch, data } = useQuery(GetAdminCollectives, {
    variables: {
      where: { ownerAddress: walletAddress }
    },
    context: { clientName: 'theGraph', chainId: activeNetwork.chainId },
    skip:
      !walletAddress ||
      !router.isReady ||
      !activeNetwork.chainId ||
      status !== Status.CONNECTED
  });

  const {
    data: memberCollectiveNfts,
    loading: loadingNfts,
    refetch: refetchNfts
  } = useQuery(GetMemberCollectives, {
    variables: {
      where: { owner: walletAddress }
    },
    context: { clientName: 'theGraph', chainId: activeNetwork.chainId },
    skip:
      !walletAddress ||
      !router.isReady ||
      !activeNetwork.chainId ||
      status !== Status.CONNECTED
  });

  useEffect(() => {
    if (status === Status.DISCONNECTED && router.isReady) {
      // clear collectives
      dispatch(setAdminCollectives([]));

      dispatch(setMemberCollectives([]));
      return;
    }

    if (
      walletAddress &&
      router.isReady &&
      activeNetwork.chainId &&
      status == Status.CONNECTED
    ) {
      refetch({
        where: { ownerAddress: walletAddress }
      });

      refetchNfts({
        where: { owner: walletAddress }
      });
    }
  }, [
    router.isReady,
    activeNetwork.chainId,
    walletAddress,
    refetch,
    refetchNfts,
    status,
    dispatch
  ]);

  // Process collectives a given wallet manages
  useEffect(() => {
    if (
      !data?.syndicateCollectives ||
      isEmpty(web3) ||
      status == Status.DISCONNECTED ||
      !walletAddress
    )
      return;

    const collectives = processedCollectives(data?.syndicateCollectives);
    dispatch(setAdminCollectives(collectives));
  }, [
    walletAddress,
    activeNetwork,
    data?.syndicateCollectives,
    loading,
    status,
    web3
  ]);

  // Process collectives a given wallet owns
  useEffect(() => {
    if (
      !memberCollectiveNfts?.nfts.length ||
      isEmpty(web3) ||
      status == Status.DISCONNECTED ||
      !walletAddress
    )
      return;

    const collectives = memberCollectiveNfts?.nfts
      .map(({ collective }) => {
        const {
          contractAddress,
          name,
          symbol,
          mintPrice,
          numMinted,
          maxTotalSupply
        } = collective;

        const totalUnclaimed = +maxTotalSupply
          ? +maxTotalSupply - +numMinted
          : +maxTotalSupply;
        return {
          totalUnclaimed,
          maxTotalSupply,
          address: contractAddress,
          tokenName: name,
          tokenSymbol: symbol,
          pricePerNft: getWeiAmount(
            web3,
            mintPrice,
            +activeNetwork.nativeCurrency.decimals,
            false
          ),
          totalClaimed: numMinted,
          tokenImage: '/images/placeholderCollectiveThumbnail.svg',
          inviteLink: `${
            window.location.origin
          }/collectives/${contractAddress}${
            '?network=' + activeNetwork.chainId
          }`
        };
      })
      .filter((collective) => collective !== undefined);

    dispatch(setMemberCollectives(collectives));
  }, [
    walletAddress,
    activeNetwork,
    memberCollectiveNfts,
    loadingNfts,
    loadingNfts,
    status,
    web3
  ]);

  const processedCollectives = (collectives): Collective[] => {
    if (!collectives || !collectives?.length) {
      return [];
    }

    setIsLoading(true);

    const processedCollectives = collectives
      .map(
        ({
          contractAddress,
          name,
          symbol,
          mintPrice,
          numMinted,
          maxTotalSupply
        }) => {
          const totalUnclaimed = +maxTotalSupply
            ? +maxTotalSupply - +numMinted
            : +maxTotalSupply;
          +maxTotalSupply ? +maxTotalSupply - +numMinted : +maxTotalSupply;
          return {
            totalUnclaimed,
            maxTotalSupply,
            address: contractAddress,
            tokenName: name,
            tokenSymbol: symbol,
            pricePerNft: getWeiAmount(
              web3,
              mintPrice,
              +activeNetwork.nativeCurrency.decimals,
              false
            ),
            totalClaimed: numMinted,
            tokenImage: '/images/placeholderCollectiveThumbnail.svg',
            inviteLink: `${
              window.location.origin
            }/collectives/${contractAddress}${
              '?network=' + activeNetwork.chainId
            }`
          };
        }
      )
      .filter((collective) => collective !== undefined);

    return processedCollectives;
  };

  return { loading: isLoading };
};

export default useCollectives;
