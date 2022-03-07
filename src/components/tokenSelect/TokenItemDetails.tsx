import React from "react";
import Image from "next/image";
import { Token } from "@/types/token";
interface TokenProps {
  symbol: string;
  name: string;
  logoURI: string;
  showCheckMark: boolean;
  isNavHighlighted?: boolean;
  onClick: () => void;
}

// render each token item inside the token select drop-down
const TokenItemDetails: React.FC<TokenProps> = ({
  symbol,
  name,
  logoURI,
  showCheckMark,
  isNavHighlighted,
  onClick,
}) => {
  return (
    <button
      className={`flex justify-between items-center w-full py-9px cursor-pointer hover:bg-gray-darkInput focus:bg-gray-syn7 transition-all ${
        isNavHighlighted ? "bg-gray-darkInput" : ""
      }`}
      onClick={onClick}
    >
      <div className="flex justify-start items-center pl-8">
        <Image src={logoURI || "/images/token-gray-4.svg"} width={30} height={30} alt={`${name} logo`}/>
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
            src={"/images/check-mark-grayscale.svg"}
            alt="Selected token"
          ></img>
        </div>
      ) : null}
    </button>
  );
};

export default TokenItemDetails;

interface TokenItemsSectionProps {
  tokenList: Token[];
  depositTokenSymbol: string;
  handleItemClick: (token: Token) => void;
  activeItemIndex?: number;
  listShift?: number;
}

export const TokenItemsSection: React.FC<TokenItemsSectionProps> = ({
  tokenList,
  depositTokenSymbol,
  handleItemClick,
  activeItemIndex,
  listShift = 0,
}) => {
  return (
    <ul>
      {tokenList.map((token, index) => {
        const { symbol, name, address, logoURI } = token;
        return (
          <li key={`${index}-${symbol}`}>
            <TokenItemDetails
              {...{ symbol, name, address, logoURI }}
              showCheckMark={symbol === depositTokenSymbol}
              onClick={() => handleItemClick(token)}
              isNavHighlighted={index + listShift === activeItemIndex}
            />
          </li>
        );
      })}
    </ul>
  );
};
