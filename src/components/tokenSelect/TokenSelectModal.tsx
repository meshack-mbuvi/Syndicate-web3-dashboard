import React, { useEffect, useState } from "react";
import Modal, { ModalStyle } from "@/components/modal";
import { TokenSelectSearch } from "@/components/tokenSelect/TokenSelectSearch";
import { coinList } from "@/containers/createInvestmentClub/shared/ClubTokenDetailConstants";
import { Token } from "@/types/token";

export interface ITokenModal {
  showModal: boolean;
  closeModal: () => void;
  variant?: TokenModalVariant;
}

export enum TokenModalVariant {
  Default,
  RecentlyUsed,
}

interface OldToken {
  name: string;
  address: string;
  symbol: string;
  decimal: number;
  logoURI: string;
  chainId?: number;
  default?: boolean;
}

function withRecently<P>(TokenSelectSearch: React.ComponentType<P>) {
  const TokenSelectSearchWithRecently = (props: P) => {
    const [recentlyUsedTokens, setRecentlyUsedTokens] = useState<Token[]>([]);

    useEffect((): void => {
      const recentTokens = localStorage.getItem("recentTokens");
      if (recentTokens) {
        setRecentlyUsedTokens(JSON.parse(recentTokens));
      }
    }, []);

    const updateRecentTokens = (token: Token) => {
      const recentTokens = localStorage.getItem("recentTokens");
      // Checks if the recent token and adds to a list if it's not already there
      if (recentTokens) {
        const parsedRecentTokens = JSON.parse(recentTokens);
        parsedRecentTokens.push(token);
        // prevents duplicates in cached coins
        const uniqueTokens = [
          ...new Map(
            parsedRecentTokens.map((recentToken: Token | OldToken) => {
              if ("decimal" in recentToken) {
                const { decimal: decimals, ...rest } = recentToken;
                recentToken = { ...rest, decimals };
              }
              return [recentToken["symbol"], recentToken];
            }),
          ).values(),
        ];
        localStorage.setItem("recentTokens", JSON.stringify(uniqueTokens));
      } else {
        localStorage.setItem("recentTokens", JSON.stringify([token]));
      }
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
  variant = TokenModalVariant.Default,
}) => {
  const RecentlyUsed = withRecently(TokenSelectSearch);

  return (
    <Modal
      modalStyle={ModalStyle.DARK}
      show={showModal}
      closeModal={() => closeModal()}
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
        <RecentlyUsed
          toggleTokenSelect={closeModal}
          defaultTokenList={coinList}
        />
      ) : (
        <TokenSelectSearch
          toggleTokenSelect={closeModal}
          defaultTokenList={coinList}
        />
      )}
    </Modal>
  );
};

export default TokenSelectModal;
