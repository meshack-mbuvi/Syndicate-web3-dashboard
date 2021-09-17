// component to show syndicate deposits progress

import { divideIfNotByZero } from "@/utils/conversions";
import { floatedNumberWithCommas } from "@/utils/formattedNumbers";
import { SkeletonLoader } from "src/components/skeletonLoader";

interface IProgressIndicator {
  depositTotal: number;
  depositTotalMax: string;
  depositERC20TokenSymbol: string;
}
export const ProgressIndicator = (props: IProgressIndicator): JSX.Element => {
  const { depositTotal, depositTotalMax, depositERC20TokenSymbol } = props;

  const showSkeletonLoader =
    !depositTotal || !depositTotalMax || !depositERC20TokenSymbol;

  // get percentage of deposits made to the syndicate
  const depositsPercentage =
    divideIfNotByZero(depositTotal, depositTotalMax) * 100;
  const currentDepositsPercentage = parseInt(depositsPercentage.toString());

  return (
    <div className="pt-4 w-full pb-14 border-b-2 border-gray-9">
      {showSkeletonLoader ? (
        <SkeletonLoader height="9" width="full" borderRadius="rounded-md" />
      ) : (
        <div>
          <div className="h-5 overflow-hidden mb-4 text-xs flex rounded-full bg-gray-9">
            <div
              style={{ width: `${currentDepositsPercentage}%` }}
              className="shadow-none flex flex-col transition-all text-center whitespace-nowrap text-white justify-center bg-blue"
            ></div>
          </div>
          <div className="flex justify-between mt-6">
            <div className="text-left">
              <p className="text-base text-gray-500 leading-loose font-light">
                Total Deposits
              </p>
              <div className="flex text-2xl">
                <p className="text-white leading-loose">
                  {floatedNumberWithCommas(depositTotal)}&nbsp;
                  {depositERC20TokenSymbol}
                </p>
                <p className="text-gray-500 leading-loose ml-4 font-light">
                  {currentDepositsPercentage}%
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-base text-gray-500 leading-loose font-light">
                Max Remaining
              </p>
              <p className="text-2xl text-white leading-loose">
                {floatedNumberWithCommas(depositTotalMax)}&nbsp;
                {depositERC20TokenSymbol}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
