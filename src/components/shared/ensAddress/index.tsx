import TransitionBetweenChildren from '@/components/transitionBetweenChildren';
import { B2, B3, B4 } from '@/components/typography';
import { formatAddress } from '@/utils/formatAddress';
import { Web3Provider } from '@ethersproject/providers';
import useFetchEnsAssets from '@/hooks/useFetchEnsAssets';

export enum AddressImageSize {
  SMALLER = 'w-5 h-5',
  SMALL = 'w-6 h-6',
  LARGE = 'w-8 h-8'
}

export enum AddressLayout {
  ONE_LINE = 'ONE_LINE',
  TWO_LINES = 'TWO_LINES'
}

interface Props {
  ethersProvider: Web3Provider;
  address?: string;
  maxDigits?: number;
  imageSize?: AddressImageSize;
  addressAbbreviated?: boolean;
  layout?: AddressLayout;
  id?: string;
  extraClasses?: string;
  userPlaceholderImg?: string | undefined;
}

export const AddressWithENS: React.FC<Props> = ({
  ethersProvider,
  address,
  maxDigits = 8,
  imageSize = AddressImageSize.SMALL,
  addressAbbreviated = false,
  layout = AddressLayout.TWO_LINES,
  extraClasses,
  userPlaceholderImg,
  ...rest
}) => {
  const formattedAddress = addressAbbreviated
    ? address
    : formatAddress(
        address,
        2 + maxDigits / 2,
        maxDigits % 2 ? (maxDigits + 1) / 2 : maxDigits / 2
      );
  const { data } = useFetchEnsAssets(address, ethersProvider);
  const TopLineName = () => {
    return <div>{data?.name}</div>;
  };
  const TopLineAddress = () => {
    return (
      <div {...rest}>
        <span className="text-gray-syn4">0x</span>
        {address && (
          <span {...rest}>
            {formatAddress(
              address.substring(2),
              maxDigits / 2,
              maxDigits % 2 ? (maxDigits + 1) / 2 : maxDigits / 2
            )}
          </span>
        )}
      </div>
    );
  };
  const TopLine = () => {
    return (
      <TransitionBetweenChildren
        visibleChildIndex={data?.name ? 0 : address ? 1 : -1}
        transitionDurationClassOverride="duration-300"
      >
        <TopLineName />
        <TopLineAddress />
      </TransitionBetweenChildren>
    );
  };
  return (
    <div
      className={`flex items-center space-x-${
        layout === AddressLayout.TWO_LINES ? '4' : '3'
      } ${extraClasses}`}
      {...rest}
    >
      {data?.avatar ? (
        <img
          src={data?.avatar}
          alt="ens"
          className={`${
            imageSize ?? 'w-8 h-8'
          } transition-all rounded-full bg-gray-syn7`}
        />
      ) : userPlaceholderImg ? (
        <img
          src={userPlaceholderImg}
          alt=""
          className={`${
            imageSize ?? 'w-8 h-8'
          } transition-all rounded-full bg-gray-syn7`}
        />
      ) : null}
      <div
        className={`${
          layout === AddressLayout.ONE_LINE && 'flex items-center space-x-2'
        } transition-all relative`}
        style={{
          top: '-0.0rem'
        }}
      >
        {/* Top line */}
        {data?.avatar && imageSize === AddressImageSize.SMALL ? (
          <B3 extraClasses="mb-0" {...rest}>
            <TopLine />
          </B3>
        ) : (
          <B2 extraClasses="mb-0" {...rest}>
            <TopLine />
          </B2>
        )}

        {/* Bottom line */}
        <div
          className={`transition-all duration-500 ${
            !data?.name && address
              ? `${layout === AddressLayout.TWO_LINES && '-mt-4'} ${
                  layout === AddressLayout.ONE_LINE && 'hidden'
                } opacity-0` // hidden
              : `${layout === AddressLayout.TWO_LINES && 'mt-0'} ${
                  layout === AddressLayout.ONE_LINE && '-mt-2'
                } opacity-100` // visible
          }`}
        >
          {address && layout === AddressLayout.TWO_LINES && (
            <B4 extraClasses={`text-gray-syn4`}>{formattedAddress}</B4>
          )}
          {address && layout === AddressLayout.ONE_LINE && (
            <B3 extraClasses={`text-gray-syn4 relative top-1`}>
              {formattedAddress}
            </B3>
          )}
        </div>
      </div>
    </div>
  );
};
