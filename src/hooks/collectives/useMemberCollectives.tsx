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

  const router = useRouter();
  const ipfsGateway = process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL || '';

  const walletAddress = useMemo(() => account.toLowerCase(), [account]);
  const [memberCollectives, setMemberCollectives] = useState<ICollective[]>([]);

  // retrieve member collectives
  const { data, loading } = useNftsQuery({
    variables: {
      where: { owner: walletAddress }
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

  // Process collectives the connected account is a member of
  useEffect(() => {
    if (loading || !data?.nfts) return;

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
            mediaData = await getCollectiveMedia(metadataCid);
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

    void Promise.all<ICollective>(processedMemberCollectives).then(
      (collectives: ICollective[]) => {
        const uniqueMemberCollectives = [
          ...new Map(
            collectives.map((collective) => [collective.address, collective])
          ).values()
        ];
        setMemberCollectives(uniqueMemberCollectives);
      }
    );
  }, [loading, data]);

  return {
    memberCollectives,
    memberCollectivesLoading:
      loading || (memberCollectives.length == 0 && data != null)
  };
};

export default useMemberCollectives;
