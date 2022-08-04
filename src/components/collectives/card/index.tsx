import { B2, B3 } from '@/components/typography';

export enum CollectiveCardType {
  TIME_WINDOW = 'TIME_WINDOW',
  MAX_SUPPLY = 'MAX_SUPPLY',
  FREE = 'FREE'
}

interface Props {
  cardType: CollectiveCardType;
  closeDate?: string;
  passes: { available: number; total: number };
  price?: { tokenAmount: number; tokenSymbol: string; tokenIcon: string };
}

export const CollectiveCard: React.FC<Props> = ({
  cardType,
  closeDate,
  passes,
  price
}) => {
  const openWindowTitle =
    cardType === CollectiveCardType.TIME_WINDOW
      ? 'Open to new members'
      : 'Passes available';
  const openWindowValue =
    cardType === CollectiveCardType.TIME_WINDOW ? (
      `Until ${closeDate}`
    ) : (
      <span>
        {passes.available}{' '}
        <span className="text-gray-syn4">of {passes.total}</span>
      </span>
    );
  const claimedPassesTitle = 'Claimed';
  const claimedPassesValue = passes.total - passes.available;
  const pricePerNFTTitle = 'Price per NFT';
  const pricePerNFTTitleValue =
    cardType === CollectiveCardType.FREE ? (
      'Free to mint'
    ) : (
      <div className="flex items-center space-x-2">
        <img src={price.tokenIcon} alt="Price" className="" />
        <div>
          {price.tokenAmount} {price.tokenSymbol}
        </div>
      </div>
    );
  return (
    <div className="xl:space-y-0 flex space-x-6 xl:items-center bg-gray-syn8 rounded-2.5xl px-6 py-6 xl:py-0 xl:px-0">
      <div
        className="rounded-xl w-24 h-24 bg-gray-syn6 flex-shrink-0"
        style={{
          backgroundImage: `url('/images/collectives/demo_punk.png')`,
          backgroundPosition: 'center',
          backgroundSize: 'cover'
        }}
      />
      <div className="items-center space-y-4 xl:space-y-0 xl:flex xl:flex-grow xl:space-x-2 xl:px-0">
        <div className="xl:w-1/3 space-y-1">
          <B3 extraClasses="text-gray-syn4">{openWindowTitle}</B3>
          <B2>{openWindowValue}</B2>
        </div>

        <div className="xl:w-1/3 space-y-1">
          <B3 extraClasses="text-gray-syn4">{claimedPassesTitle}</B3>
          <B2>{claimedPassesValue}</B2>
        </div>

        <div className="xl:w-1/3 space-y-1">
          <B3 extraClasses="text-gray-syn4">{pricePerNFTTitle}</B3>
          <B2>{pricePerNFTTitleValue}</B2>
        </div>
      </div>
    </div>
  );
};
