import { GetAdminCollectives, GetMemberCollectives } from '@/graphql/queries';
import { getJson } from '@/hooks/collectives/create/useFetchNftMetadata';
import { AppState } from '@/state';
import {
  setAdminCollectives,
  setMemberCollectives
} from '@/state/collectives/slice';
import { Collective, TokenMediaType } from '@/state/collectives/types';
import { Status } from '@/state/wallet/types';
import { getWeiAmount } from '@/utils/conversions';
import { useQuery } from '@apollo/client';
import { isEmpty } from 'lodash';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const useCollectives = (): { loading: boolean } => {
  const dispatch = useDispatch();

  const {
    web3Reducer: { web3: web3Instance }
  } = useSelector((state: AppState) => state);

  const router = useRouter();
  const ipfsGateway = process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL;

  const { account, activeNetwork, web3, status } = web3Instance;
  const walletAddress = useMemo(() => account.toLowerCase(), [account]);
  const [isLoading, setIsLoading] = useState(true);

  // retrieve admin collectives
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

  // retrieve member collectives
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

  // get media info for a collective
  const getCollectiveMedia = async (
    metadataCid: string
  ): Promise<{
    animation_url: string;
    description: string;
    image: string;
    name: string;
    symbol: string;
  }> => {
    let mediaData = null;
    // putting this 'hash' check here because I noticed there are some
    // test collectives with the value set to an actual 'hash'
    if (metadataCid && metadataCid !== 'hash') {
      mediaData = await getJson(metadataCid);
    }

    return mediaData;
  };

  // process collectives the connected account is the admin of
  const processCollectives = useCallback(
    async (collectives) => {
      if (!collectives || !collectives?.length) {
        dispatch(setAdminCollectives([]));
        return [];
      }

      setIsLoading(true);

      const processedAdminCollectives = collectives
        .map(
          async ({
            contractAddress,
            name,
            symbol,
            mintPrice,
            numMinted,
            maxTotalSupply,
            totalSupply,
            nftMetadata: { metadataCid }
          }) => {
            // get collective image/video
            let mediaData = null;
            if (metadataCid && metadataCid !== 'hash') {
              mediaData = await getCollectiveMedia(metadataCid);
            }

            const totalUnclaimed = +maxTotalSupply
              ? +maxTotalSupply - +totalSupply
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
              totalClaimed: totalSupply,
              tokenMedia: mediaData?.animation_url
                ? `${ipfsGateway}/${mediaData?.animation_url.replace(
                    'ipfs://',
                    ''
                  )}`
                : mediaData?.image
                ? `${ipfsGateway}/${mediaData?.image.replace('ipfs://', '')}`
                : '/images/placeholderCollectiveThumbnail.svg',
              tokenMediaType: mediaData?.animation_url
                ? TokenMediaType.ANIMATION
                : TokenMediaType.IMAGE,
              inviteLink: `${
                window.location.origin
              }/collectives/${contractAddress}${
                '?chain=' + activeNetwork.network
              }`
            };
          }
        )
        .filter((collective) => collective !== undefined);

      Promise.all<Collective>(processedAdminCollectives).then(
        (collective: Collective[]) => {
          dispatch(setAdminCollectives(collective));
        }
      );
    },
    [web3, activeNetwork, dispatch, ipfsGateway]
  );

  // Process collectives the connected account is the admin of
  useEffect(() => {
    if (
      !data?.syndicateCollectives ||
      isEmpty(web3) ||
      status == Status.DISCONNECTED ||
      !walletAddress
    )
      return;

    processCollectives(data?.syndicateCollectives);
  }, [
    walletAddress,
    activeNetwork,
    data?.syndicateCollectives,
    loading,
    status,
    web3,
    processCollectives
  ]);

  // Process collectives the connected account is a member of
  useEffect(() => {
    if (
      !memberCollectiveNfts?.nfts.length ||
      isEmpty(web3) ||
      status == Status.DISCONNECTED ||
      !walletAddress
    ) {
      dispatch(setMemberCollectives([]));
      return;
    }

    const processedMemberCollectives = memberCollectiveNfts?.nfts
      .map(async ({ collective }) => {
        const {
          contractAddress,
          name,
          symbol,
          mintPrice,
          maxTotalSupply,
          totalSupply,
          nftMetadata: { metadataCid }
        } = collective;

        // get collective image/video
        let mediaData = null;
        if (metadataCid && metadataCid !== 'hash') {
          mediaData = await getCollectiveMedia(metadataCid);
        }

        const totalUnclaimed = +maxTotalSupply
          ? +maxTotalSupply - +totalSupply
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
          totalClaimed: totalSupply,
          tokenMedia: mediaData?.animation_url
            ? `${ipfsGateway}/${mediaData?.animation_url.replace(
                'ipfs://',
                ''
              )}`
            : mediaData?.image
            ? `${ipfsGateway}/${mediaData?.image.replace('ipfs://', '')}`
            : '/images/placeholderCollectiveThumbnail.svg',
          tokenMediaType: mediaData?.animation_url
            ? TokenMediaType.ANIMATION
            : TokenMediaType.IMAGE,
          inviteLink: `${
            window.location.origin
          }/collectives/${contractAddress}${'?chain=' + activeNetwork.network}`
        };
      })
      .filter((collective) => collective !== undefined);

    Promise.all<Collective>(processedMemberCollectives).then(
      (collectives: Collective[]) => {
        const uniqueMemberCollectives = [
          ...new Map(
            collectives.map((collective) => [collective.address, collective])
          ).values()
        ];
        dispatch(setMemberCollectives(uniqueMemberCollectives));
      }
    );
  }, [
    walletAddress,
    activeNetwork,
    memberCollectiveNfts,
    loadingNfts,
    loadingNfts,
    status,
    web3,
    dispatch,
    ipfsGateway
  ]);

  return { loading: isLoading };
};

export default useCollectives;
