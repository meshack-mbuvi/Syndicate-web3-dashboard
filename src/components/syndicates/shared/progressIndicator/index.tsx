// component to show syndicate deposits progress
import { useGrayDecimalNumber } from "@/hooks/useGrayDecimalNumber";
import { divideIfNotByZero } from "@/utils/conversions";
import { floatedNumberWithCommas } from "@/utils/formattedNumbers";
import { SkeletonLoader } from "src/components/skeletonLoader";

interface IProgressIndicator {
  totalDeposits: number;
  depositTotalMax: string;
  depositERC20TokenSymbol: string;
  openDate: string;
  closeDate: string;
  loading?: boolean;
}
export const ProgressIndicator = (props: IProgressIndicator): JSX.Element => {
  const {
    totalDeposits,
    depositTotalMax,
    depositERC20TokenSymbol,
    loading = false,
  } = props;

  // get percentage of deposits made to the syndicate

  const depositsPercentage =
    divideIfNotByZero(totalDeposits, depositTotalMax) * 100;

  const remainingDeposits =
    parseFloat(depositTotalMax) - parseFloat(totalDeposits.toString());

  const formattedTotalDeposits = useGrayDecimalNumber(
    floatedNumberWithCommas(totalDeposits),
  );
  const formattedRemainingDeposits = useGrayDecimalNumber(
    floatedNumberWithCommas(remainingDeposits),
  );

  return (
    <div className="w-full xl:pb-14 pb-10 border-b-2 border-gray-syn6">
      {loading ? (
        <div>
          <div className="mb-4">
            <SkeletonLoader
              height="5"
              width="full"
              borderRadius="rounded-full"
            />
          </div>
          <div className="flex justify-between mt-6">
            <div className="w-1/4">
              <SkeletonLoader
                height="3"
                width="full"
                borderRadius="rounded-full"
              />
              <SkeletonLoader
                height="6"
                width="full"
                borderRadius="rounded-lg"
              />
            </div>
            <div className="w-1/4 items-end place-content-end">
              <SkeletonLoader
                height="3"
                width="full"
                borderRadius="rounded-full"
              />
              <SkeletonLoader
                height="6"
                width="full"
                borderRadius="rounded-lg"
              />
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="h-5 overflow-hidden mb-4 text-sm flex rounded-full bg-gray-9">
            <div
              style={{ width: `${floatedNumberWithCommas(depositsPercentage)}%` }}
              className="shadow-none flex flex-col transition-all text-center whitespace-nowrap text-white justify-center bg-blue"
            ></div>
          </div>
          <div className="flex justify-between mt-6">
            <div className="text-left">
              <p className="text-gray-syn4 leading-6 pb-2">Deposits</p>
              <div className="flex">
                <p className="text-white leading-loose xl:text-2xl lg:text-xl text-base">
                  {formattedTotalDeposits}&nbsp;
                  {depositERC20TokenSymbol}
                </p>
                <p className="xl:text-2xl lg:text-xl text-gray-lightManatee leading-loose ml-4 font-whyte-light">
                  {floatedNumberWithCommas(depositsPercentage)}
                  {/* Temporary fix to add font weight to symbol  */}
                  <span
                    style={{
                      fontFamily: "Arial",
                      fontWeight: 300,
                    }}
                  >
                    %
                  </span>
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-gray-syn4 leading-6 pb-2">Remaining</p>
              <p className="xl:text-2xl lg:text-xl text-sm text-white leading-loose">
                {remainingDeposits > 0 ? formattedRemainingDeposits : 0}&nbsp;
                {depositERC20TokenSymbol}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
