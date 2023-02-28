import { getCollectiveMedia } from '@/hooks/collectives/utils/helpers';
import {
  ICollective,
  IGraphNFTResponse,
  TokenMediaType
} from '@/hooks/collectives/utils/types';
import { SUPPORTED_GRAPHS } from '@/Networks/backendLinks';
import { AppState } from '@/state';
import { Status } from '@/state/wallet/types';
import { getWeiAmount } from '@/utils/conversions';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNftsQuery } from '../data-fetching/thegraph/generated-types';

const useMemberCollectives = (): {
  memberCollectives: ICollective[];
  memberCollectivesLoading: boolean;
} => {
  const {
    web3Reducer: {
      web3: { account, activeNetwork, status }
    }
  } = useSelector((state: AppState) => state);

  const abortController = new AbortController();
  const router = useRouter();
  const ipfsGateway = process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL || '';

  const walletAddress = useMemo(() => account.toLowerCase(), [account]);
  const [memberCollectives, setMemberCollectives] = useState<ICollective[]>([]);
  const [isProcessingCollectives, setProcessingCollectives] =
    useState<boolean>(false);

  // retrieve member collectives
  const { data, loading, refetch, error } = useNftsQuery({
    variables: {
      where: { owner: account?.toLowerCase() }
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
      activeNetwork.chainId === 137 ||
      activeNetwork.chainId === 0
  });

  useEffect(() => {
    //TODO: hardcoded check that its not polygon until collectives are on polygon
    // and activeNetwork is not init value of 0
    if (
      !error &&
      activeNetwork.chainId !== 137 &&
      activeNetwork.chainId !== 0
    ) {
      void refetch({
        where: { owner: walletAddress }
      });
    }

    return () => {
      abortController.abort();
    };
  }, [activeNetwork.chainId, walletAddress]);

  // Process collectives the connected account is a member of
  useEffect(() => {
    if (!loading && data?.nfts) {
      setProcessingCollectives(true);
      const processedMemberCollectives: Promise<ICollective>[] = (
        data?.nfts as IGraphNFTResponse[]
      )
        .map(
          async ({
            collective: {
              contractAddress,
              name,
              symbol,
              mintPrice,
              maxTotalSupply,
              totalSupply,
              nftMetadata: { metadataCid }
            }
          }) => {
            // get collective image/video
            let mediaData = null;
            if (metadataCid && metadataCid !== 'hash') {
              mediaData = await getCollectiveMedia(
                metadataCid,
                abortController.signal
              );
            }

            const totalUnclaimed = +maxTotalSupply
              ? +maxTotalSupply - +totalSupply
              : +maxTotalSupply;
            return {
              totalUnclaimed,
              maxTotalSupply: +maxTotalSupply,
              address: contractAddress,
              tokenName: name,
              tokenSymbol: symbol,
              pricePerNft: +getWeiAmount(
                mintPrice,
                +activeNetwork.nativeCurrency.decimals,
                false
              ),
              totalClaimed: +totalSupply,
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

      Promise.all<ICollective>(processedMemberCollectives)
        .then((collectives: ICollective[]) => {
          const uniqueMemberCollectives = [
            ...new Map(
              collectives.map((collective) => [collective.address, collective])
            ).values()
          ];
          setMemberCollectives(uniqueMemberCollectives);
        })
        .catch(() => setMemberCollectives([]))
        .finally(() => setProcessingCollectives(false));
    } else if (!loading) {
      setMemberCollectives([]);
    }
  }, [loading, data]);

  return {
    memberCollectives,
    memberCollectivesLoading: loading || isProcessingCollectives
  };
};

export default useMemberCollectives;
