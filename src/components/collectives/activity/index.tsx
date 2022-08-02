import { B2, B3 } from '@/components/typography';
import { formatAddress } from '@/utils/formatAddress';

export enum CollectiveActivityType {
  RECEIVED = 'RECEIVED',
  TRANSFER = 'TRANSFER',
  SALE = 'SALE',
  LIST = 'LIST',
  OFFER = 'OFFER'
}

interface Props {
  activityType: CollectiveActivityType;
  timeStamp?: string;
  profile?: { picture?: string; username?: string; address?: string };
  transfer?: {
    fromUsername?: string;
    fromAddress?: string;
    toUsername?: string;
    toAddress?: string;
  };
  sale?: {
    fromUsername?: string;
    fromAddress?: string;
    toUsername?: string;
    toAddress?: string;
    tokenAmount: number;
    tokenSymbol: string;
    tokenIcon: string;
  };
  list?: {
    username?: string;
    address?: string;
    tokenAmount: number;
    tokenSymbol: string;
    tokenIcon: string;
  };
  offer?: {
    username?: string;
    address?: string;
    tokenAmount: number;
    tokenSymbol: string;
    tokenIcon: string;
  };
  externalLink?: string;
}

export const CollectiveActivity: React.FC<Props> = ({
  activityType,
  timeStamp,
  profile,
  transfer,
  sale,
  list,
  offer,
  externalLink
}) => {
  const formattedAddress = formatAddress(profile.address, 6, 4);

  return (
    <a href={externalLink} className="flex justify-between items-center">
      <div>
        {activityType === CollectiveActivityType.RECEIVED && (
          <div className="flex space-x-2 items-center">
            <img
              src={profile.picture || '/images/user.svg'}
              alt="Profile"
              className="w-6 h-6 rounded-full"
            />

            <B2>
              {profile.username ? (
                `@${profile.username}`
              ) : profile.address ? (
                <>
                  <span className="text-gray-syn4">
                    {formattedAddress.slice(0, 2)}
                  </span>
                  {formattedAddress.slice(2)}
                </>
              ) : (
                ''
              )}{' '}
              <span className="text-gray-syn4">joined the collective</span>
            </B2>
          </div>
        )}
        {activityType === CollectiveActivityType.TRANSFER && (
          <div className="flex space-x-2 items-center">
            <div className="w-6 h-6 rounded-full bg-gray-syn3 flex-shrink-0">
              <img
                src="/images/collectives/transfer.svg"
                alt="Transfer"
                className="mx-auto vertically-center flex-shrink-0"
              />
            </div>
            <div className="flex space-x-2 items-center">
              <B2>
                Collective NFT{' '}
                <span className="text-gray-syn4">transfered from </span>
                {transfer.fromUsername
                  ? `@${transfer.fromUsername}`
                  : transfer.fromAddress
                  ? transfer.fromAddress
                  : ''}{' '}
                <span className="text-gray-syn4">to </span>
                {transfer.toUsername
                  ? `@${transfer.toUsername}`
                  : transfer.toAddress
                  ? transfer.toAddress
                  : ''}
              </B2>
            </div>
          </div>
        )}
        {activityType === CollectiveActivityType.SALE && (
          <div className="flex space-x-2 items-center">
            <div className="w-6 h-6 rounded-full bg-gray-syn3 flex-shrink-0">
              <img
                src="/images/collectives/sale.svg"
                alt="Sale"
                className="mx-auto vertically-center flex-shrink-0"
              />
            </div>
            <div className="flex space-x-2 items-center">
              <B2>
                Collective NFT <span className="text-gray-syn4">sold by </span>
                {sale.fromUsername
                  ? `@${sale.fromUsername}`
                  : sale.fromAddress
                  ? sale.fromAddress
                  : ''}{' '}
                <span className="text-gray-syn4">to </span>
                {sale.toUsername
                  ? `@${sale.toUsername}`
                  : sale.toAddress
                  ? sale.toAddress
                  : ''}{' '}
                <span className="text-gray-syn4">for </span>
                <img
                  src="/images/chains/ethereum.svg"
                  alt="Transfer"
                  className="mx-auto relative -top-0.5 px-0.5 flex-shrink-0 inline"
                />{' '}
                {sale.tokenAmount} {sale.tokenSymbol}
              </B2>
            </div>
          </div>
        )}
        {activityType === CollectiveActivityType.LIST && (
          <div className="flex space-x-2 items-center">
            <div className="w-6 h-6 rounded-full bg-gray-syn3 flex-shrink-0">
              <img
                src="/images/collectives/list.svg"
                alt="Sale"
                className="mx-auto vertically-center flex-shrink-0"
              />
            </div>
            <div className="flex space-x-2 items-center">
              <B2>
                {list.username
                  ? `@${list.username}`
                  : list.address
                  ? list.address
                  : ''}
                <span className="text-gray-syn4"> listed </span> Collective NFT{' '}
                <span className="text-gray-syn4">for </span>
                <img
                  src="/images/chains/ethereum.svg"
                  alt="Transfer"
                  className="mx-auto relative -top-0.5 px-0.5 flex-shrink-0 inline"
                />{' '}
                {list.tokenAmount} {list.tokenSymbol}
              </B2>
            </div>
          </div>
        )}
        {activityType === CollectiveActivityType.OFFER && (
          <div className="flex space-x-2 items-center">
            <div className="w-6 h-6 rounded-full bg-gray-syn3 flex-shrink-0">
              <img
                src="/images/collectives/offer.svg"
                alt="Sale"
                className="mx-auto vertically-center flex-shrink-0"
              />
            </div>
            <div className="flex space-x-2 items-center">
              <B2>
                {offer.username
                  ? `@${offer.username}`
                  : offer.address
                  ? offer.address
                  : ''}
                <span className="text-gray-syn4"> offered to buy </span>{' '}
                Collective NFTs <span className="text-gray-syn4">for </span>
                <img
                  src="/images/chains/ethereum.svg"
                  alt="Transfer"
                  className="mx-auto relative -top-0.5 px-0.5 flex-shrink-0 inline"
                />{' '}
                {offer.tokenAmount} {offer.tokenSymbol}
              </B2>
            </div>
          </div>
        )}
      </div>
      {externalLink ? (
        <img
          src="/images/externalLinkGray4.svg"
          alt="External link"
          className="flex-shrink-0"
        />
      ) : timeStamp ? (
        <B3 extraClasses="text-gray-syn4 flex-shrink-0 ml-2">{timeStamp}</B3>
      ) : null}
    </a>
  );
};
