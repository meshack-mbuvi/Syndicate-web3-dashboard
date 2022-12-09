import { GetAdminCollectives } from '@/graphql/queries';
import { AppState } from '@/state';
import { Status } from '@/state/wallet/types';
import { getWeiAmount } from '@/utils/conversions';
import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { getCollectiveMedia } from '@/hooks/collectives/utils/helpers';
import {
  ICollective,
  IGraphCollectiveResponse,
  TokenMediaType
} from '@/hooks/collectives/utils/types';
import { SUPPORTED_GRAPHS } from '@/Networks/backendLinks';

const useAdminCollectives = (): {
  adminCollectives: ICollective[];
  adminCollectivesLoading: boolean;
} => {
  const {
    web3Reducer: {
      web3: { account, activeNetwork, web3, status }
    }
  } = useSelector((state: AppState) => state);

  const router = useRouter();
  const ipfsGateway = process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL || '';

  const walletAddress = useMemo(() => account.toLowerCase(), [account]);
  const [adminCollectives, setAdminCollectives] = useState<ICollective[]>([]);

  // retrieve admin collectives
  const { loading, refetch, data } = useQuery(GetAdminCollectives, {
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
      status !== Status.CONNECTED
  });

  useEffect(() => {
    refetch({
      where: { ownerAddress: walletAddress }
    });
  }, [activeNetwork.chainId, walletAddress]);

  useEffect(() => {
    if (loading || !data?.syndicateCollectives) return;

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
            mediaData = await getCollectiveMedia(metadataCid);
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
            pricePerNft: getWeiAmount(
              web3,
              mintPrice,
              +activeNetwork.nativeCurrency.decimals,
              false
            ) as number,
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

    void Promise.all<ICollective>(processedAdminCollectives).then(
      (collective: ICollective[]) => {
        setAdminCollectives(collective);
      }
    );
  }, [loading, data]);

  return {
    adminCollectives,
    adminCollectivesLoading:
      loading || (adminCollectives.length == 0 && data != null)
  };
};

export default useAdminCollectives;
