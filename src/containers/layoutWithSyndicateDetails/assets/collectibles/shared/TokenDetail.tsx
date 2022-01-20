import React from "react";
import { AppState } from "@/state";
import { useSelector } from "react-redux";
import { floatedNumberWithCommas } from "@/utils/formattedNumbers";
import PriceContainer from "./PriceContainer";

const TokenDetail: React.FC<{ title: string; value: any; symbol?: any }> = ({
  title,
  value,
  symbol,
}) => {
  const {
    assetsSliceReducer: { ethereumTokenPrice },
  } = useSelector((state: AppState) => state);

  let floorPriceFormattedTotalValue, purchasePriceFormattedTotalValue;
  let clubBalance, balanceValue;
  if (title === "Floor price") {
    const floorPriceValue = value * ethereumTokenPrice;

    const [floorPriceETHValue, floorPriceETHDecimalValue] =
      floatedNumberWithCommas(value).split(".");

    floorPriceFormattedTotalValue = (
      <div className="flex flex-col items-end">
        {" "}
        <PriceContainer
          wholeNumberValue={floorPriceETHValue}
          decimalValue={floorPriceETHDecimalValue}
        >
          &nbsp;
          {"ETH"}
        </PriceContainer>
        <div className="text-gray-syn4">
          {floatedNumberWithCommas(floorPriceValue)} USD
        </div>
      </div>
    );
  }

  if (title === "Last purchase price") {
    const { lastPurchasePriceUSD, lastPurchasePriceETH } = value;

    const [purchasePriceETHValue, purchasePriceETHDecimalValue] =
      floatedNumberWithCommas(lastPurchasePriceETH).split(".");

    purchasePriceFormattedTotalValue = (
      <div className="flex flex-col items-end">
        <PriceContainer
          wholeNumberValue={purchasePriceETHValue}
          decimalValue={purchasePriceETHDecimalValue}
        >
          &nbsp;
          {"ETH"}
        </PriceContainer>

        <div className="text-gray-syn4">
          {floatedNumberWithCommas(lastPurchasePriceUSD)} USD
        </div>
      </div>
    );
  }

  if (title === "Club balance") {
    const [tokenBalance, balanceDecimalValue] =
      floatedNumberWithCommas(value).split(".");
    balanceValue = (
      <div className="flex flex-col items-end">
        <PriceContainer
          wholeNumberValue={tokenBalance}
          decimalValue={balanceDecimalValue}
        >
          &nbsp;
          {symbol}
        </PriceContainer>
      </div>
    );
  }

  if (title === "Value") {
    const [tokenWorth, worthDecimalValue] =
      floatedNumberWithCommas(value).split(".");
    clubBalance = (
      <div className="flex flex-col items-end">
        <PriceContainer
          wholeNumberValue={tokenWorth}
          decimalValue={worthDecimalValue}
        >
          &nbsp;
          {"USD"}
        </PriceContainer>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between py-4 border-b-1 border-gray-syn6">
      <div className="text-gray-syn4 w-1/2">
        <span>{title}</span>
      </div>
      <div className="w-1/2 text-right overflow-scroll no-scroll-bar">
        {purchasePriceFormattedTotalValue
          ? purchasePriceFormattedTotalValue
          : floorPriceFormattedTotalValue
          ? floorPriceFormattedTotalValue
          : clubBalance || balanceValue || value}
      </div>
    </div>
  );
};

export default TokenDetail;
