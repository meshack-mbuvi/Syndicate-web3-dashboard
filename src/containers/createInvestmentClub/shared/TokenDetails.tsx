import { setDepositTokenDetails } from "@/state/createInvestmentClub/slice";
import Image from "next/image";
import React from "react";
import { useDispatch } from "react-redux";

interface TokenProps {
  symbol: string;
  name: string;
  address: string;
  logoURI: string;
  toggleTokenSelect: any;
  showCheckMark: boolean;
  onClick: () => void;
}

const abi = require("human-standard-token-abi");

// render each token item inside the token select drop-down
const TokenDetails = (props: TokenProps) => {
  const { symbol, name, logoURI, showCheckMark, onClick } = props;

  const dispatch = useDispatch();

  // push deposit token details to the redux store
  const storeDepositTokenDetails = async (tokenDetails) => {
    const { symbol, name, address, logoURI, decimals } = tokenDetails;

    dispatch(
      setDepositTokenDetails({
        depositTokenAddress: address,
        depositTokenSymbol: symbol,
        depositTokenLogo: logoURI,
        depositTokenName: name,
        depositTokenDecimals: +decimals,
      }),
    );
    // close the token select menu after a token is clicked
    // toggleTokenSelect();
    onClick();
  };
  return (
    <button
      className="flex justify-between items-center w-full py-4 px-4 rounded-md cursor-pointer hover:bg-gray-darkInput focus:bg-gray-syn7 transition-all"
      onClick={() => storeDepositTokenDetails({ ...props })}
    >
      <div className="flex justify-start items-center">
        <Image src={logoURI} width={24} height={24} />
        <p className="text-white text-base sm:text-base ml-3">{name}</p>
        <div className="inline-flex pl-6">
          <p className="text-gray-3 text-base sm:text-base uppercase">
            {symbol}
          </p>
        </div>
      </div>
      {/* checkmark should show on selected token */}
      {showCheckMark ? (
        <div>
          <img
            className="text-gray-3 text-sm sm:text-base uppercase"
            width={16}
            height={15}
            src={"/images/check-mark-grayscale.svg"}
            alt=""
          ></img>
        </div>
      ) : null}
    </button>
  );
};

export default TokenDetails;
