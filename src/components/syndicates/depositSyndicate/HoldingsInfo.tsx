import { FC } from "react";
import { numberWithCommas } from "@/utils/formattedNumbers";

interface IHoldingsInfoProps {
  title: string;
  amount: string;
  tokenName: string;
  percentValue?: number;
}

const HoldingsInfo: FC<IHoldingsInfoProps> = ({
  title,
  amount,
  tokenName,
  percentValue,
}: IHoldingsInfoProps) => {
  const [wholeNumberPart, decimalPart] = amount.toString().split(".");

  return (
    <div>
      <div className="pb-1 text-gray-syn4 text-base">{title}</div>
      <div className="flex">
        <div>
          <div className="inline">
            {numberWithCommas(wholeNumberPart as string)}
          </div>
          <div className="inline text-gray-syn4">
            {decimalPart ? "." + decimalPart : ""}
          </div>
          &nbsp;
        </div>
        <div>{tokenName}</div>
        {percentValue && (
          <div className="text-gray-syn4 ml-2">({percentValue}%)</div>
        )}
      </div>
    </div>
  );
};

export default HoldingsInfo;
