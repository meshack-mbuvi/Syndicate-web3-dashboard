import { SkeletonLoader } from '@/components/skeletonLoader';
import { B2, B3 } from '@/components/typography';
import useFetchCollectiveMetadata from '@/hooks/collectives/create/useFetchNftMetadata';
import useERC721Collective from '@/hooks/collectives/useERC721Collective';
import { RequirementType } from '@/hooks/data-fetching/thegraph/generated-types';
import { floatedNumberWithCommas } from '@/utils/formattedNumbers';
import clsx from 'clsx';

interface Props {
  cardType: RequirementType;
  closeDate?: string;
  passes: { available: number; total: number };
  price?: { tokenAmount: string; tokenSymbol: string; tokenIcon: string };
}

export const CollectiveCard: React.FC<Props> = ({
  cardType,
  closeDate,
  passes,
  price
}) => {
  const {
    collectiveDetails: { numOwners, metadataCid, mintPrice }
  } = useERC721Collective();
  const ipfsGateway = process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL || '';

  // intermediate step to fetch the nft details from the metadataCid
  const { data: nftMetadata, isLoading: isLoadingNftMetadata } =
    useFetchCollectiveMetadata(metadataCid);

  const openWindowTitle =
    cardType === RequirementType.TimeWindow
      ? 'Open to new members'
      : 'NFTs available';
  const openWindowValue =
    cardType === RequirementType.TimeWindow ? (
      `Until ${closeDate || ''}`
    ) : cardType === RequirementType.MaxTotalSupply ? (
      <span>
        {floatedNumberWithCommas(passes.available - passes.total)}{' '}
        <span className="text-gray-syn4">
          of {floatedNumberWithCommas(passes.available)}
        </span>
      </span>
    ) : (
      <span>-</span>
    );

  const numberOfMembersTitle = 'Members';
  const numberOfMembersValue = numOwners;

  const pricePerNFTTitle = 'Price per NFT';
  const pricePerNFTTitleValue =
    +mintPrice === 0 ? (
      'Free to mint'
    ) : (
      <div className="flex items-center space-x-2 justify-end">
        <img src={price?.tokenIcon} alt="Price" className="h-5 w-5 mr-1" />
        <div>
          {price?.tokenAmount} {price?.tokenSymbol}
        </div>
      </div>
    );

  const cardinfoResponsiveStyles =
    'flex xl:flex-col space-y-0 w-full justify-between items-center xl:items-start xl:justify-start xl:flex-col xl:w-1/3 xl:space-y-1';

  return (
    <div className="xl:space-y-0 flex space-x-6 xl:items-center bg-gray-syn8 rounded-2.5xl px-6 py-6 xl:py-0 xl:px-0">
      {isLoadingNftMetadata && (
        <SkeletonLoader
          width="24"
          height="24"
          borderRadius="rounded-xl"
          margin="my-0"
          customClass="flex-shrink-0"
        />
      )}
      {nftMetadata?.animation_url && (
        <video
          autoPlay
          playsInline={true}
          loop
          muted={true}
          className={`${'object-cover'} rounded-xl flex-shrink-0 w-24 h-24 bg-gray-syn6`}
        >
          <source
            src={`${ipfsGateway}/${nftMetadata?.animation_url.replace(
              'ipfs://',
              ''
            )}`}
            type="video/mp4"
          ></source>
        </video>
      )}
      {nftMetadata?.image && (
        <div
          className="rounded-xl w-24 h-24 flex-shrink-0 bg-gray-syn6"
          style={{
            backgroundImage: `url(${ipfsGateway}/${nftMetadata?.image.replace(
              'ipfs://',
              ''
            )})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        ></div>
      )}

      <div
        className={clsx(
          'items-start w-full space-y-2.5 xl:space-y-0 xl:flex xl:flex-grow xl:space-x-2 xl:px-0',
          !isLoadingNftMetadata && !nftMetadata && 'mx-6 py-6'
        )}
      >
        <div className={cardinfoResponsiveStyles}>
          <B3 extraClasses="text-gray-syn4">{openWindowTitle}</B3>
          <B2>{openWindowValue}</B2>
        </div>

        <div className={cardinfoResponsiveStyles}>
          <B3 extraClasses="text-gray-syn4">{numberOfMembersTitle}</B3>
          <B2>{floatedNumberWithCommas(numberOfMembersValue)}</B2>
        </div>

        <div className={cardinfoResponsiveStyles}>
          <B3 extraClasses="text-gray-syn4">{pricePerNFTTitle}</B3>
          <B2>{pricePerNFTTitleValue}</B2>
        </div>
      </div>
    </div>
  );
};
