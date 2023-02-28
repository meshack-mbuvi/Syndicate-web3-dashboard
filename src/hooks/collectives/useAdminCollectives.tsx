import { getCollectiveMedia } from '@/hooks/collectives/utils/helpers';
import {
  ICollective,
  IGraphCollectiveResponse,
  TokenMediaType
} from '@/hooks/collectives/utils/types';
import { useSyndicateCollectivesQuery } from '@/hooks/data-fetching/thegraph/generated-types';
import { SUPPORTED_GRAPHS } from '@/Networks/backendLinks';
import { AppState } from '@/state';
import { Status } from '@/state/wallet/types';
import { getWeiAmount } from '@/utils/conversions';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

const useAdminCollectives = (): {
  adminCollectives: ICollective[];
  adminCollectivesLoading: boolean;
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
  const [adminCollectives, setAdminCollectives] = useState<ICollective[]>([]);
  const [isProcessingCollectives, setProcessingCollectives] =
    useState<boolean>(false);
  // retrieve admin collectives
  const { loading, data, error, refetch } = useSyndicateCollectivesQuery({
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
        where: { ownerAddress: walletAddress }
      });
    }

    return () => {
      abortController.abort();
    };
  }, [activeNetwork.chainId, walletAddress]);

  useEffect(() => {
    if (!loading && data?.syndicateCollectives) {
      setProcessingCollectives(true);
      const processedAdminCollectives: Promise<ICollective>[] = (
        data?.syndicateCollectives as IGraphCollectiveResponse[]
      )
        .map(
          async ({
            contractAddress,
            name,
            symbol,
            mintPrice,
            maxTotalSupply,
            totalSupply,
            nftMetadata: { metadataCid }
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
            // TODO: What's going on with this line? Is it necessary?
            // Can numMinted be replaced with totalSupply?
            // +maxTotalSupply ? +maxTotalSupply - +totalSupply : +maxTotalSupply;

            let tokenMedia = '/images/placeholderCollectiveThumbnail.svg';
            let tokenMediaType = TokenMediaType.IMAGE;
            if (mediaData?.animation_url) {
              tokenMedia = `${ipfsGateway}/${mediaData?.animation_url.replace(
                'ipfs://',
                ''
              )}`;
              tokenMediaType = TokenMediaType.ANIMATION;
            } else if (mediaData?.image) {
              tokenMedia = `${ipfsGateway}/${mediaData?.image.replace(
                'ipfs://',
                ''
              )}`;
            }

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
              tokenMedia,
              tokenMediaType,
              inviteLink: `${
                window.location.origin
              }/collectives/${contractAddress}${
                '?chain=' + activeNetwork.network
              }`
            };
          }
        )
        .filter((collective) => collective !== undefined);

      Promise.all<ICollective>(processedAdminCollectives)
        .then((collectives: ICollective[]) => setAdminCollectives(collectives))
        .catch(() => setAdminCollectives([]))
        .finally(() => setProcessingCollectives(false));
    } else if (!loading) {
      setAdminCollectives([]);
    }
  }, [loading, data]);

  return {
    adminCollectives,
    adminCollectivesLoading: loading || isProcessingCollectives
  };
};

export default useAdminCollectives;
