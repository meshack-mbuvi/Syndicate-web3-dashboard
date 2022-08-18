import FadeBetweenChildren from '@/components/fadeBetweenChildren';
import { B2, B3, B4 } from '@/components/typography';
import { formatAddress } from '@/utils/formatAddress';

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
  image?: { src: string; size?: AddressImageSize };
  name?: string;
  address?: { label: string; abbreviated?: boolean };
  layout?: AddressLayout;
}

export const AddressWithENS: React.FC<Props> = ({
  image,
  name,
  address,
  layout = AddressLayout.TWO_LINES
}) => {
  return (
    <div
      className={`flex items-center space-x-${
        layout === AddressLayout.TWO_LINES ? '4' : '3'
      }`}
    >
      {image && (
        <img
          src={image.src ? `${image.src}` : '/images/jazzicon.png'}
          alt="Address icon"
          className={`${
            image.size ? image.size : 'w-8 h-8'
          } transition-all rounded-full bg-gray-syn7`}
        />
      )}
      <div
        className={`${
          layout === AddressLayout.ONE_LINE && 'flex items-center space-x-2'
        } transition-all relative`}
        style={{
          top: '-0.0rem'
        }}
      >
        {/* Top line */}
        <B2 extraClasses="mb-0">
          <FadeBetweenChildren
            visibleChildIndex={name ? 0 : address ? 1 : -1}
            transitionClassesOverride="duration-300"
          >
            <div>{name}</div>
            <div>
              <span className="text-gray-syn4">0x</span>
              {address && (
                <span>
                  {address?.abbreviated !== undefined && address?.abbreviated
                    ? formatAddress(address.label.substring(2), 4, 4)
                    : address.label.substring(2)}
                </span>
              )}
            </div>
          </FadeBetweenChildren>
        </B2>

        {/* Bottom line */}
        <div
          className={`transition-all duration-500 ${
            !name && address
              ? `${layout === AddressLayout.TWO_LINES && '-mt-4'} ${
                  layout === AddressLayout.ONE_LINE && 'hidden'
                } opacity-0` // hidden
              : `${layout === AddressLayout.TWO_LINES && 'mt-0'} ${
                  layout === AddressLayout.ONE_LINE && '-mt-2'
                } opacity-100` // visible
          }`}
        >
          {address && layout === AddressLayout.TWO_LINES && (
            <B4 extraClasses={`text-gray-syn4`}>
              {address?.abbreviated
                ? formatAddress(address.label, 6, 4)
                : address.label}
            </B4>
          )}
          {address && layout === AddressLayout.ONE_LINE && (
            <B3 extraClasses={`text-gray-syn4 relative top-1`}>
              {address?.abbreviated
                ? formatAddress(address.label, 6, 4)
                : address.label}
            </B3>
          )}
        </div>
      </div>
    </div>
  );
};
