import React, { useEffect } from 'react';
import Image from 'next/image';
import { Token } from '@/types/token';
import { SkeletonLoader } from '@/components/skeletonLoader';
export interface TokenDetailsProps {
  symbol: string;
  name: string;
  logoURI: string;
  showCheckMark: boolean;
  isNavHighlighted?: boolean;
  onClick: () => void;
}

// render each token item inside the token select drop-down
const TokenItemDetails: React.FC<TokenDetailsProps> = ({
  symbol,
  name,
  logoURI,
  showCheckMark,
  isNavHighlighted,
  onClick
}) => {
  const ref = React.createRef<HTMLButtonElement>();

  useEffect(() => {
    if (isNavHighlighted && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isNavHighlighted, ref]);

  return (
    <button
      className={`flex justify-between items-center w-full py-9px cursor-pointer hover:bg-gray-darkInput focus:bg-gray-syn7 transition-all ${
        isNavHighlighted ? 'bg-gray-darkInput' : ''
      }`}
      onClick={onClick}
      aria-pressed={isNavHighlighted}
      ref={ref}
    >
      <div className="flex justify-start items-center pl-8">
        <Image
          src={logoURI || '/images/token-gray-4.svg'}
          width={30}
          height={30}
          alt={`${name} logo`}
        />
        <p className="text-white text-base sm:text-base ml-3">{name}</p>
        <div className="inline-flex ml-3">
          <p className="text-gray-3 text-base sm:text-base uppercase">
            {symbol}
          </p>
        </div>
      </div>
      {/* checkmark should show on selected token */}
      {showCheckMark ? (
        <div className="justify-end pr-8">
          <img
            className="text-gray-3 text-sm sm:text-base uppercase"
            width={16}
            height={15}
            src={'/images/check-mark-grayscale.svg'}
            alt="Selected token"
          ></img>
        </div>
      ) : null}
    </button>
  );
};

export default TokenItemDetails;

export interface TokenItemsSectionProps {
  tokenList: Token[];
  depositTokenSymbol: string;
  handleItemClick: (token: Token) => void;
  loading?: boolean;
  activeItemIndex?: number;
  listShift?: number;
}

export const TokenItemsSection: React.FC<TokenItemsSectionProps> = ({
  tokenList,
  depositTokenSymbol,
  handleItemClick,
  activeItemIndex,
  listShift = 0
}) => {
  return (
    <ul>
      {tokenList.map((token, index) => {
        const { symbol, name, address, logoURI } = token;

        const isNavHighlighted = index + listShift === activeItemIndex;
        return (
          <li key={`${index + listShift}-${symbol}`}>
            <TokenItemDetails
              {...{ symbol, name, address, logoURI }}
              showCheckMark={symbol === depositTokenSymbol}
              onClick={() => handleItemClick(token)}
              isNavHighlighted={isNavHighlighted}
            />
          </li>
        );
      })}
    </ul>
  );
};

export const TokenItemsLoadingSection: React.FC<{ repeat?: number }> = ({
  repeat = 3
}) => {
  return (
    <>
      {[...Array(repeat)].map((_, index) => (
        <div
          className="flex justify-between mt-2 px-8"
          key={`skeleton-${index}`}
        >
          <div className="w-7 h-7">
            <SkeletonLoader
              animate
              height="7"
              width="full"
              margin="m-0"
              borderRadius="rounded-full"
            />
          </div>
          <div className="w-full items-end place-content-end h-7 ml-4">
            <SkeletonLoader
              height="7"
              width="full"
              margin="m-0"
              borderRadius="rounded-md"
            />
          </div>
        </div>
      ))}
    </>
  );
};
