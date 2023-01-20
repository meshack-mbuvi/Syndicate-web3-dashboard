import Modal, { ModalStyle } from '@/components/modal';
import { TokenSelectSearch } from '@/components/tokenSelect/TokenSelectSearch';
import { Token } from '@/types/token';
import React, { useEffect, useState } from 'react';

export interface ITokenModal {
  showModal: boolean;
  closeModal: () => void;
  chainId: number;
  variant?: TokenModalVariant;
}

export enum TokenModalVariant {
  Default,
  RecentlyUsed
}

interface OldToken {
  name: string;
  address: string;
  symbol: string;
  decimal?: number;
  logoURI: string;
  chainId?: number;
  default?: boolean;
}

function withRecently<P>(
  TokenSelectSearch: React.ComponentType<P>,
  chainId: number
) {
  const TokenSelectSearchWithRecently = (props: P) => {
    const [recentlyUsedTokens, setRecentlyUsedTokens] = useState<Token[]>([]);

    useEffect((): void => {
      const recentTokens = localStorage.getItem('recentTokens');
      if (recentTokens && recentTokens[chainId]) {
        const tokens: Record<number, Token[]> = JSON.parse(recentTokens);
        if (tokens[chainId]) {
          setRecentlyUsedTokens(tokens[chainId]);
        }
      }
    }, []);

    const updateRecentTokens = (token: Token) => {
      const recentTokens = localStorage.getItem('recentTokens');
      // Checks if the recent token and adds to a list if it's not already there
      if (recentTokens) {
        const tokens: Record<number, Token[]> = JSON.parse(recentTokens);
        if (tokens[chainId]) {
          const parsedRecentTokens = tokens[chainId];
          parsedRecentTokens.push(token);
          // prevents duplicates in cached coins
          const uniqueTokens = [
            ...new Map(
              parsedRecentTokens.map((recentToken: Token | OldToken) => {
                if ('decimal' in recentToken) {
                  const { decimal: decimals, ...rest } = recentToken;
                  recentToken = { ...rest, decimals };
                }
                return [recentToken['symbol'], recentToken];
              })
            ).values()
          ];
          setTokensToStorage(uniqueTokens);
        } else {
          setTokensToStorage([token], JSON.parse(recentTokens));
        }
      } else {
        setTokensToStorage([token]);
      }
    };

    const setTokensToStorage = (
      tokens: Token[],
      recentTokens?: Record<number, Token[]> | undefined
    ) => {
      localStorage.setItem(
        'recentTokens',
        JSON.stringify({ ...recentTokens, [chainId]: tokens })
      );
    };

    return (
      <TokenSelectSearch
        {...props}
        suggestionList={recentlyUsedTokens}
        suggestionListTitle="Recently used"
        updateSuggestionList={updateRecentTokens}
      />
    );
  };
  return TokenSelectSearchWithRecently;
}

/**
 * Modal for selecting a token
 * Before using RecentlyUsed, please verify that storing tokens in localStorage is not a vulnerability
 * @param {TokenModalVariant} variant
 */
const TokenSelectModal: React.FC<ITokenModal> = ({
  showModal,
  closeModal,
  chainId,
  variant = TokenModalVariant.Default
}) => {
  const RecentlyUsed = withRecently(TokenSelectSearch, chainId);

  return (
    <Modal
      modalStyle={ModalStyle.DARK}
      show={showModal}
      closeModal={(): void => closeModal()}
      customWidth="sm:w-564 w-full"
      customClassName="p-0"
      showCloseButton={false}
      outsideOnClick={true}
      showHeader={false}
      overflow="overflow-x-visible"
      overflowYScroll={false}
      isMaxHeightScreen={false}
      alignment="align-top"
      margin="mt-48"
    >
      {variant === TokenModalVariant.RecentlyUsed ? (
        <RecentlyUsed toggleTokenSelect={closeModal} variant={variant} />
      ) : (
        <TokenSelectSearch toggleTokenSelect={closeModal} variant={variant} />
      )}
    </Modal>
  );
};

export default TokenSelectModal;
