import { numberWithCommas } from "@/utils/formattedNumbers";
import { FC } from "react";

interface IHoldingsInfoProps {
  title: string;
  amount: string;
  tokenName: string;
  percentValue?: number;
  loading?: boolean;
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
        <div className="mr-2 w-min-44">{tokenName}</div>
        {percentValue && (
          <div className="text-gray-syn4">{`(${percentValue} %)`}</div>
        )}
      </div>
    </div>
  );
};

export default HoldingsInfo;
