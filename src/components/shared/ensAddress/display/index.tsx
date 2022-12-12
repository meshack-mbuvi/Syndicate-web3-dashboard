import TransitionBetweenChildren from '@/components/transition/transitionBetweenChildren';
import { B2, B3, B4 } from '@/components/typography';
import { JazziconGenerator } from '@/features/auth/components/jazziconGenerator';
import { formatAddress } from '@/utils/formatAddress';

export enum AddressImageSize {
  SMALLEST = 'w-4.5 h-4.5',
  SMALLER = 'w-5 h-5', // 20px => 1.25rem
  SMALL = 'w-6 h-6', // 24px => 1.5rem
  LARGE = 'w-8 h-8' // 32px => 2rem
}

export enum AddressLayout {
  ONE_LINE = 'ONE_LINE',
  TWO_LINES = 'TWO_LINES'
}

interface Props {
  name?: string;
  address?: string;
  maxDigits?: number;
  imageSize?: AddressImageSize;
  image?: string | null | undefined;
  addressAbbreviated?: boolean;
  layout?: AddressLayout;
  onlyShowOneOfNameOrAddress?: boolean;
  id?: string;
  extraClasses?: string;
  userPlaceholderImg?: string | undefined;
  customTailwindXSpacingUnit?: number;
  disableTransition?: boolean;
  disabled?: boolean;
}

export const DisplayAddressWithENS: React.FC<Props> = ({
  name,
  address,
  maxDigits = 8,
  imageSize = AddressImageSize.SMALL,
  image,
  addressAbbreviated = false,
  layout = AddressLayout.TWO_LINES,
  onlyShowOneOfNameOrAddress,
  extraClasses,
  userPlaceholderImg,
  customTailwindXSpacingUnit,
  disableTransition,
  disabled,
  ...rest
}: Props) => {
  const formattedAddress = addressAbbreviated
    ? address
    : formatAddress(
        // @ts-expect-error TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
        address,
        2 + maxDigits / 2,
        maxDigits % 2 ? (maxDigits + 1) / 2 : maxDigits / 2
      );
  const TopLineName = (): JSX.Element => {
    return (
      <div className="truncate" style={{ maxWidth: '84px' }}>
        {name}
      </div>
    );
  };
  const TopLineAddress = (): JSX.Element => {
    return (
      <div {...rest}>
        <span className={`${disabled ? 'text-gray-syn5' : 'text-gray-syn4'}`}>
          0x
        </span>
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
        visibleChildIndex={name ? 0 : address ? 1 : -1}
        transitionDurationClassOverride={`${
          disableTransition ? 'duration-0' : 'duration-300'
        }`}
      >
        <TopLineName />
        <TopLineAddress />
      </TransitionBetweenChildren>
    );
  };
  return (
    <div
      className={`flex items-center space-x-${
        customTailwindXSpacingUnit
          ? customTailwindXSpacingUnit
          : layout === AddressLayout.TWO_LINES
          ? '4'
          : '3'
      } ${extraClasses ?? ''}`}
      {...rest}
    >
      {/* Icon */}
      {image || userPlaceholderImg ? (
        <img
          src={image ? image : userPlaceholderImg}
          alt="ens"
          className={`${
            imageSize ?? 'w-8 h-8'
          } transition-all rounded-full bg-gray-syn7`}
        />
      ) : address ? (
        <JazziconGenerator
          address={address}
          diameterRem={
            imageSize === AddressImageSize.SMALL
              ? 1.5
              : imageSize === AddressImageSize.SMALLER
              ? 1.25
              : imageSize === AddressImageSize.LARGE
              ? 2
              : 0
          }
        />
      ) : null}

      <div
        className={`${
          (layout === AddressLayout.ONE_LINE &&
            'flex items-center space-x-2') ||
          ''
        } ${disableTransition ? '' : 'transition-all'} relative`}
        style={{
          top: '-0.0rem'
        }}
      >
        {/* Top line / ens */}
        {/* With two lines layout this acts as the ens name */}
        {/* With one line layout this acts as the ens name to the left of the address, or just address if no ens */}
        {image && imageSize === AddressImageSize.SMALL ? (
          <B3 extraClasses="mb-0" {...rest}>
            <TopLine />
          </B3>
        ) : (
          <B2 extraClasses="mb-0" {...rest}>
            <TopLine />
          </B2>
        )}

        {/* Bottom line / address */}
        <div
          className={`${onlyShowOneOfNameOrAddress ? 'hidden' : ''} ${
            (!disableTransition && 'transition-all duration-500') || ''
          } ${
            !name && address
              ? `${(layout === AddressLayout.TWO_LINES && '-mt-4') || ''} ${
                  (layout === AddressLayout.ONE_LINE && 'hidden') || ''
                } opacity-0` // hidden
              : `${(layout === AddressLayout.TWO_LINES && 'mt-0') || ''} ${
                  (layout === AddressLayout.ONE_LINE && '-mt-2') || ''
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
