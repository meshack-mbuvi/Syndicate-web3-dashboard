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
  return (
    <div className="space-y-6 sm:space-y-0 sm:flex sm:space-x-6 sm:items-center bg-gray-syn8 rounded-2.5xl px-6 py-6 sm:py-0 sm:px-0">
      <div
        className="rounded-xl w-24 h-24 bg-gray-syn6 flex-shrink-0"
        style={{
          backgroundImage: `url('/images/collectives/demo_punk.png')`,
          backgroundPosition: 'center',
          backgroundSize: 'cover'
        }}
      />
      <div className="space-y-4 sm:space-y-0 sm:flex sm:flex-grow sm:space-x-2 sm:px-0">
        <div className="sm:w-1/3 space-y-1">
          <B3 extraClasses="text-gray-syn4">
            {cardType === CollectiveCardType.TIME_WINDOW
              ? 'Open to new members'
              : 'Passes available'}
          </B3>
          <B2>
            {cardType === CollectiveCardType.TIME_WINDOW ? (
              `Until ${closeDate}`
            ) : (
              <span>
                {passes.available}{' '}
                <span className="text-gray-syn4">of {passes.total}</span>
              </span>
            )}
          </B2>
        </div>
        <div className="sm:w-1/3 space-y-1">
          <B3 extraClasses="text-gray-syn4">Claimed</B3>
          <B2>{passes.total - passes.available}</B2>
        </div>
        <div className="sm:w-1/3 space-y-1">
          <B3 extraClasses="text-gray-syn4">Price per NFT</B3>
          <B2>
            {cardType === CollectiveCardType.FREE ? (
              'Free to mint'
            ) : (
              <div className="flex items-center space-x-2">
                <img src={price.tokenIcon} alt="Price" className="" />
                <div>
                  {price.tokenAmount} {price.tokenSymbol}
                </div>
              </div>
            )}
          </B2>
        </div>
      </div>
    </div>
  );
};
