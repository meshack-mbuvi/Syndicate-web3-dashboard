import { B2, B3 } from '@/components/typography';
import { formatAddress } from '@/utils/formatAddress';
import moment from 'moment';

export enum CollectiveActivityType {
  CREATED = 'CREATED',
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
  // @ts-expect-error TS(2532): Object is possibly 'undefined'.
  const formattedAddress = formatAddress(profile.address, 6, 4);

  return (
    <a href={externalLink} className="flex justify-between items-center">
      <div>
        {activityType === CollectiveActivityType.RECEIVED ||
        activityType === CollectiveActivityType.CREATED ? (
          <div className="flex space-x-2 items-center">
            <img
              // @ts-expect-error TS(2532): Object is possibly 'undefined'.
              src={profile.picture || '/images/user.svg'}
              alt="Profile"
              className="w-6 h-6 rounded-full"
            />

            <B2>
              {profile?.username ? (
                `@${profile.username}`
              ) : profile?.address ? (
                <>
                  <span className="text-gray-syn4">
                    {formattedAddress.slice(0, 2)}
                  </span>
                  {formattedAddress.slice(2)}
                </>
              ) : (
                ''
              )}{' '}
              <span className="text-gray-syn4">
                {activityType === CollectiveActivityType.CREATED
                  ? 'created the collective'
                  : 'joined the collective'}
              </span>
            </B2>
          </div>
        ) : null}
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
                {
                  // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                  transfer.fromUsername
                    ? // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                      `@${transfer.fromUsername}`
                    : // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                    transfer.fromAddress
                    ? // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                      transfer.fromAddress
                    : ''
                }{' '}
                <span className="text-gray-syn4">to </span>
                {
                  // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                  transfer.toUsername
                    ? // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                      `@${transfer.toUsername}`
                    : // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                    transfer.toAddress
                    ? // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                      transfer.toAddress
                    : ''
                }
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
                {
                  // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                  sale.fromUsername
                    ? // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                      `@${sale.fromUsername}`
                    : // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                    sale.fromAddress
                    ? // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                      sale.fromAddress
                    : ''
                }{' '}
                <span className="text-gray-syn4">to </span>
                {
                  // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                  sale.toUsername
                    ? // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                      `@${sale.toUsername}`
                    : // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                    sale.toAddress
                    ? // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                      sale.toAddress
                    : ''
                }{' '}
                <span className="text-gray-syn4">for </span>
                <img
                  src="/images/chains/ethereum.svg"
                  alt="Transfer"
                  className="mx-auto relative -top-0.5 px-0.5 flex-shrink-0 inline"
                />{' '}
                {
                  // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                  sale.tokenAmount
                }{' '}
                {
                  // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                  sale.tokenSymbol
                }
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
                {
                  // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                  list.username
                    ? // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                      `@${list.username}`
                    : // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                    list.address
                    ? // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                      list.address
                    : ''
                }
                <span className="text-gray-syn4"> listed </span> Collective NFT{' '}
                <span className="text-gray-syn4">for </span>
                <img
                  src="/images/chains/ethereum.svg"
                  alt="Transfer"
                  className="mx-auto relative -top-0.5 px-0.5 flex-shrink-0 inline"
                />{' '}
                {
                  // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                  list.tokenAmount
                }{' '}
                {
                  // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                  list.tokenSymbol
                }
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
                {
                  // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                  offer.username
                    ? // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                      `@${offer.username}`
                    : // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                    offer.address
                    ? // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                      offer.address
                    : ''
                }
                <span className="text-gray-syn4"> offered to buy </span>{' '}
                Collective NFTs <span className="text-gray-syn4">for </span>
                <img
                  src="/images/chains/ethereum.svg"
                  alt="Transfer"
                  className="mx-auto relative -top-0.5 px-0.5 flex-shrink-0 inline"
                />{' '}
                {
                  // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                  offer.tokenAmount
                }{' '}
                {
                  // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                  offer.tokenSymbol
                }
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
        <B3 extraClasses="text-gray-syn4 flex-shrink-0 ml-2">
          {moment(+timeStamp * 1000).fromNow()}
        </B3>
      ) : null}
    </a>
  );
};
