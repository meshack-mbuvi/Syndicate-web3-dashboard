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
    <div className="pt-14 w-full pb-14 mb-14 border-b-1 border-gray-steelGrey">
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
              <p className="text-base text-gray-lightManatee font-light pb-2">
                Deposits
              </p>
              <div className="flex">
                <p className="text-white leading-loose xl:text-2xl lg:text-xl text-base">
                  {floatedNumberWithCommas(depositTotal)}&nbsp;
                  {depositERC20TokenSymbol}
                </p>
                <p className="xl:text-2xl lg:text-xl text-gray-lightManatee leading-loose ml-4 font-extralight">
                  {currentDepositsPercentage}%
                </p>
              </div>
              <p className="text-sm leading-4 text-gray-lightManatee font-light pt-1">
                Opened {format(new Date(parseInt(openDate) * 1000), "MMM dd")}
              </p>
            </div>
            <div className="text-right">
              <p className="text-base text-gray-lightManatee font-light pb-2">
                Remaining
              </p>
              <p className="xl:text-2xl lg:text-xl text-base text-white">
                {floatedNumberWithCommas(depositTotalMax)}&nbsp;
                {depositERC20TokenSymbol}
              </p>
              <p className="text-sm leading-4 text-gray-lightManatee font-light pt-1">
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
