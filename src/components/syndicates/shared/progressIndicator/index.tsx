// component to show syndicate deposits progress

import { divideIfNotByZero } from "@/utils/conversions";
import { getCountDownDays } from "@/utils/dateUtils";
import { floatedNumberWithCommas } from "@/utils/formattedNumbers";
import { format } from "date-fns-tz";
import { SkeletonLoader } from "src/components/skeletonLoader";

interface IProgressIndicator {
  depositTotal: number;
  depositTotalMax: string;
  depositERC20TokenSymbol: string;
  openDate: string;
  closeDate: string;
}
export const ProgressIndicator = (props: IProgressIndicator): JSX.Element => {
  const {
    depositTotal,
    depositTotalMax,
    depositERC20TokenSymbol,
    openDate,
    closeDate,
  } = props;

  const showSkeletonLoader =
    !depositTotal || !depositTotalMax || !depositERC20TokenSymbol;

  const closeDatePassed = new Date(parseInt(openDate) * 1000) > new Date();

  // get percentage of deposits made to the syndicate
  const depositsPercentage =
    divideIfNotByZero(depositTotal, depositTotalMax) * 100;
  const currentDepositsPercentage = parseInt(depositsPercentage.toString());

  return (
    <div className="pt-4 w-full xl:pb-14 pb-10 border-b-2 border-gray-9">
      {showSkeletonLoader ? (
        <SkeletonLoader height="9" width="full" borderRadius="rounded-md" />
      ) : (
        <div>
          <div className="h-5 overflow-hidden mb-4 text-sm flex rounded-full bg-gray-9">
            <div
              style={{ width: `${currentDepositsPercentage}%` }}
              className="shadow-none flex flex-col transition-all text-center whitespace-nowrap text-white justify-center bg-blue"
            ></div>
          </div>
          <div className="flex justify-between mt-6">
            <div className="text-left">
              <p className="text-sm text-gray-500 leading-loose">
                Deposits
              </p>
              <div className="flex">
                <p className="text-white leading-loose xl:text-2xl lg:text-xl text-base">
                  {floatedNumberWithCommas(depositTotal)}&nbsp;
                  {depositERC20TokenSymbol}
                </p>
                <p className="xl:text-2xl lg:text-xl text-sm text-gray-500 leading-loose ml-4">
                  {currentDepositsPercentage}%
                </p>
              </div>
              <p className="text-sm text-gray-500 leading-loose">
                Opened {format(new Date(parseInt(openDate) * 1000), "MMM dd")}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 leading-loose">
                Remaining
              </p>
              <p className="xl:text-2xl lg:text-xl text-sm text-white leading-loose">
                {floatedNumberWithCommas(depositTotalMax)}&nbsp;
                {depositERC20TokenSymbol}
              </p>
              <p className="text-sm text-gray-500 leading-loose">
                {closeDatePassed ? "Closed " : "Closing in "}
                {getCountDownDays(closeDate)}
                {closeDatePassed ? " ago" : ""}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
