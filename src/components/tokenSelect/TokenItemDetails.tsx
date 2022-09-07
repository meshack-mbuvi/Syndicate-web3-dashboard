import React, { useEffect } from 'react';
import Image from 'next/image';
import { Token } from '@/types/token';
import { SkeletonLoader } from '@/components/skeletonLoader';
import { AppState } from '@/state';
import { useSelector } from 'react-redux';
import ExternalLinkIcon from '../icons/externalLink';
import { ImportButton } from './ImportToken';
import { CollectiveIcon } from '@/components/collectives/collectiveIcon';

export interface TokenDetailsProps {
  symbol: string;
  name: string;
  logoURI: string;
  showCheckMark: boolean;
  isNavHighlighted?: boolean;
  onClick: () => void;
  price?: number;
  address?: string;
  showImportBtn?: boolean;
  collectionCount?: number;
  decimals?: number;
  collectionMediaType?: string;
}

// render each token item inside the token select drop-down
const TokenItemDetails: React.FC<TokenDetailsProps> = ({
  symbol,
  name,
  logoURI,
  collectionMediaType,
  price,
  collectionCount,
  decimals,
  address,
  showCheckMark,
  isNavHighlighted,
  onClick,
  showImportBtn
}) => {
  const ref = React.createRef<HTMLButtonElement>();

  const {
    createInvestmentClubSliceReducer: { showTokenGateModal }
  } = useSelector((state: AppState) => state);

  useEffect(() => {
    if (isNavHighlighted && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isNavHighlighted, ref]);

  return (
    <div
      className={`flex flex-row items-center hover:bg-gray-darkInput focus:bg-gray-syn7  ${
        isNavHighlighted ? 'bg-gray-darkInput' : ''
      }`}
    >
      <button
        className={`flex justify-between items-center w-full py-9px transition-all ${
          showImportBtn ? 'cursor-default' : 'cursor-pointer'
        }`}
        onClick={onClick}
        aria-pressed={isNavHighlighted}
        ref={ref}
        disabled={showImportBtn}
      >
        <div className="flex justify-start items-center pl-8">
          {logoURI && collectionMediaType ? (
            <CollectiveIcon
              tokenMedia={logoURI}
              tokenMediaType={collectionMediaType}
            />
          ) : (
            <Image
              src={logoURI || '/images/token-gray-5.svg'}
              width={30}
              height={30}
              alt={`${name} logo`}
            />
          )}

          <div className="flex flex-col ml-3">
            <div className="flex">
              <p className="text-white text-base sm:text-base">{name}</p>
              <div className="inline-flex ml-3">
                <p className="text-gray-3 text-base sm:text-base uppercase">
                  {symbol}
                </p>
              </div>
            </div>
            {showImportBtn && (
              <div className="flex flex-row items-center">
                <span className="text-sm text-left text-gray-syn4 pr-1">
                  via CoinGecko
                </span>
                <Image
                  src="/images/coingecko.svg"
                  alt="CoinGecko"
                  width={16}
                  height={16}
                />
              </div>
            )}
          </div>
        </div>
        {/* checkmark should show on selected token */}
        {showCheckMark && !showTokenGateModal ? (
          <div className="justify-end pr-8">
            <Image
              className="text-gray-3 text-sm sm:text-base uppercase"
              width={16}
              height={15}
              src="/images/check-mark-grayscale.svg"
              alt="Selected token"
            />
          </div>
        ) : null}
        {/* Show Token price */}
        {showTokenGateModal ? (
          <div className="flex flex-row items-center justify-end text-gray-syn4">
            {price || collectionCount ? (
              <>
                <Image
                  className="text-gray-3 text-sm sm:text-base uppercase"
                  width={20}
                  height={20}
                  src={'/images/ETH.svg'}
                  alt="eth-logo"
                />
                <span className="pr-3">
                  {collectionCount ? `${collectionCount} items` : `$${price}`}
                </span>
              </>
            ) : null}
          </div>
        ) : null}
      </button>
      {showTokenGateModal && (
        <div className={showImportBtn ? 'pr-3' : 'pr-8'}>
          <TokenExternalLink address={address} />
        </div>
      )}
      {showImportBtn && (
        <ImportButton
          token={{
            symbol,
            name,
            logoURI,
            price,
            address,
            collectionCount,
            decimals
          }}
        />
      )}
    </div>
  );
};

export default TokenItemDetails;

export interface TokenItemsSectionProps {
  tokenList: Token[];
  depositTokenSymbol: string;
  handleItemClick: (token: Token) => void;
  allActiveTokens: Token[];
  loading?: boolean;
  activeItemIndex?: number;
  // listShift?: number;
  showImportBtn?: boolean;
}

export const TokenItemsSection: React.FC<TokenItemsSectionProps> = ({
  tokenList,
  depositTokenSymbol,
  handleItemClick,
  allActiveTokens,
  activeItemIndex,
  showImportBtn
}) => {
  return (
    <ul>
      {tokenList.map((token, index) => {
        const { symbol } = token;

        let currentToken;
        if (allActiveTokens?.length) {
          currentToken = allActiveTokens[activeItemIndex];
        }
        const isNavHighlighted = token == currentToken;

        return (
          <li key={`${index + currentToken}-${symbol}`}>
            <TokenItemDetails
              {...token}
              showCheckMark={symbol === depositTokenSymbol}
              onClick={() => handleItemClick(token)}
              isNavHighlighted={isNavHighlighted}
              showImportBtn={showImportBtn}
            />
          </li>
        );
      })}
    </ul>
  );
};

export const TokenItemsLoadingSection: React.FC<{
  repeat?: number;
  showInfoLoader?: boolean;
}> = ({ repeat = 3, showInfoLoader = false }) => {
  return (
    <div className="mt-2">
      {[...Array(repeat)].map((_, index) => (
        <div className="flex w-full mt-2 px-8" key={`skeleton-${index}`}>
          <div className=" h-7">
            <SkeletonLoader
              animate
              height="7"
              width="7"
              margin="m-0"
              borderRadius="rounded-full"
            />
          </div>
          <div className="w-full h-7 ml-4">
            <SkeletonLoader
              height="7"
              width="full"
              margin="m-0"
              borderRadius="rounded-md"
            />
          </div>

          {showInfoLoader && (
            <div className="flex w-full items-end place-content-end h-7">
              <div className="w-full h-7 justify-end flex">
                <SkeletonLoader
                  height="7"
                  width="2/3"
                  margin="m-0"
                  borderRadius="rounded-md"
                />
              </div>
              <div className="h-7 ml-4">
                <SkeletonLoader
                  animate
                  height="7"
                  width="7"
                  margin="m-0"
                  borderRadius="rounded-full"
                />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

interface ITokenExternalLink {
  address: string;
}

export const TokenExternalLink: React.FC<ITokenExternalLink> = ({
  address
}) => {
  const {
    web3Reducer: {
      web3: {
        activeNetwork: {
          blockExplorer: { baseUrl }
        }
      }
    }
  } = useSelector((state: AppState) => state);

  return (
    <a href={`${baseUrl}/address/${address}`} target="_blank" rel="noreferrer">
      {address && <ExternalLinkIcon />}
    </a>
  );
};
