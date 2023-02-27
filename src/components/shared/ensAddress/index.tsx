import useFetchEnsAssets from '@/hooks/useFetchEnsAssets';
import { Web3Provider } from '@ethersproject/providers';
import { DisplayAddressWithENS } from './display';

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
  ethersProvider?: Web3Provider | null;
  address?: string;
  maxDigits?: number;
  imageSize?: AddressImageSize;
  addressAbbreviated?: boolean;
  layout?: AddressLayout;
  id?: string;
  extraClasses?: string;
  userPlaceholderImg?: string | undefined;
  disableTransition?: boolean;
  disabled?: boolean;
  customTailwindXSpacingUnit?: number;
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
  disableTransition = false,
  disabled = false,
  customTailwindXSpacingUnit,
  ...rest
}: Props) => {
  // @ts-expect-error TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message        // @ts-expect-error TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
  const { data } = useFetchEnsAssets(address, ethersProvider);
  return (
    <DisplayAddressWithENS
      name={data?.name}
      address={address}
      maxDigits={maxDigits}
      imageSize={imageSize}
      image={data?.avatar}
      addressAbbreviated={addressAbbreviated}
      layout={layout}
      extraClasses={extraClasses}
      userPlaceholderImg={userPlaceholderImg}
      disableTransition={disableTransition}
      disabled={disabled}
      customTailwindXSpacingUnit={customTailwindXSpacingUnit}
      {...rest}
    />
  );
};
