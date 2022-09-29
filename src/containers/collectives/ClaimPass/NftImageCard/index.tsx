import { CollectivesInteractiveBackground } from '@/components/collectives/interactiveBackground';
import { NFTMediaType } from '@/components/collectives/nftPreviewer';
import { SkeletonLoader } from '@/components/skeletonLoader';
import useFetchCollectiveMetadata from '@/hooks/collectives/create/useFetchNftMetadata';
import useERC721Collective from '@/hooks/collectives/useERC721Collective';

const NftImageCard: React.FC = () => {
  const {
    collectiveDetails: { metadataCid },
    collectiveDetailsLoading
  } = useERC721Collective();

  const { data: nftMetadata, isLoading: isLoadingNftMetadata } =
    useFetchCollectiveMetadata(metadataCid);
  const ipfsGateway = process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL;

  return (
    <div
      className="flex items-center justify-center w-full h-80 sm:h-auto sm:w-5/12"
      style={{
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundOrigin: 'center center'
      }}
    >
      <div className="flex items-center justify-center w-full h-full border-gray-syn4">
        {collectiveDetailsLoading ? (
          <SkeletonLoader width="20" height="20" borderRadius="rounded-none" />
        ) : (
          <CollectivesInteractiveBackground
            heightClass="h-full"
            widthClass="w-full"
            isLoadingFloatingIcon={isLoadingNftMetadata}
            mediaType={
              nftMetadata?.animation_url
                ? NFTMediaType.VIDEO
                : nftMetadata?.image
                ? NFTMediaType.IMAGE
                : NFTMediaType.CUSTOM
            }
            floatingIcon={
              nftMetadata?.animation_url
                ? `${ipfsGateway}/${nftMetadata?.animation_url.replace(
                    'ipfs://',
                    ''
                  )}`
                : // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                  `${ipfsGateway}/${nftMetadata?.image.replace('ipfs://', '')}`
            }
            numberOfParticles={75}
          />
        )}
      </div>
    </div>
  );
};

export default NftImageCard;
