import { floatedNumberWithCommas } from '@/utils/formattedNumbers';
import { FC } from 'react';

interface IHoldingsInfoProps {
  title: string;
  amount: string;
  tokenName: string;
  percentValue?: number | string;
  loading?: boolean;
  wrap?: string;
  amountInUSD?: number;
}

const HoldingsInfo: FC<IHoldingsInfoProps> = ({
  title,
  amount,
  tokenName,
  percentValue,
  wrap,
  amountInUSD
}: IHoldingsInfoProps) => {
  return (
    <div>
      <div className="pb-2 leading-6 text-gray-syn4">{title}</div>
      <div className={`flex ${wrap}`}>
        <div>
          <p className="mr-1.5">{amount}</p>
        </div>
        <div className="mr-2 w-min-44">{tokenName}</div>
        {percentValue && (
          <div className="text-gray-syn4 ">{`(${percentValue}%)`}</div>
        )}
      </div>
      {amountInUSD ? (
        <p className="text-gray-syn4">
          ~ {floatedNumberWithCommas(amountInUSD)} USD
        </p>
      ) : null}
    </div>
  );
};

export default HoldingsInfo;
