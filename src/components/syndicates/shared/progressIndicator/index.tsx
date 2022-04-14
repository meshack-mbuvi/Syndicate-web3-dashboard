// component to show syndicate deposits progress
import { divideIfNotByZero } from '@/utils/conversions';
import { floatedNumberWithCommas } from '@/utils/formattedNumbers';
import { SkeletonLoader } from 'src/components/skeletonLoader';
import NumberTreatment from '@/components/NumberTreatment';
import { TokenDetails } from '@/hooks/useGetDepositTokenDetails';
interface IProgressIndicator {
  totalDeposits: number;
  depositTotalMax: string;
  openDate: string;
  closeDate: string;
  loading?: boolean;
  nativeDepositToken: boolean;
  depositTokenPriceInUSD: string;
  tokenDetails: TokenDetails;
}

export const ProgressIndicator = (props: IProgressIndicator): JSX.Element => {
  const {
    totalDeposits = 0,
    depositTotalMax,
    loading = false,
    nativeDepositToken = false,
    depositTokenPriceInUSD,
    tokenDetails,
  } = props;

  // get percentage of deposits made to the syndicate
  const depositsPercentage =
    divideIfNotByZero(totalDeposits, depositTotalMax) * 100;

  const remainingDeposits =
    parseFloat(depositTotalMax) - parseFloat(totalDeposits.toString());

  return (
    <div className="w-full xl:pb-14 pb-10 border-b-1 border-gray-syn6">
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
          <div className="h-5 overflow-hidden mb-4 text-sm flex rounded-full bg-gray-syn7">
            <div
              style={{
                width: `${floatedNumberWithCommas(depositsPercentage)}%`
              }}
              className="shadow-none flex flex-col transition-all text-center whitespace-nowrap text-white justify-center bg-blue"
            ></div>
          </div>
          <div className="flex justify-between mt-6">
            <div className="text-left">
              <p className="text-gray-syn4 leading-6 pb-2">Deposits</p>
              <h2 className="flex">
                <p>
                  <NumberTreatment
                    numberValue={`${totalDeposits || ''}`}
                    nativeDepositToken={nativeDepositToken}
                  />
                  &nbsp;
                  {nativeDepositToken ? 'ETH' : tokenDetails.symbol}
                </p>
                <p className="text-gray-lightManatee ml-4 font-light">
                  {floatedNumberWithCommas(depositsPercentage)}
                  {/* Temporary fix to add font weight to symbol  */}
                  <span
                    style={{
                      fontFamily: 'Arial',
                      fontWeight: 300
                    }}
                  >
                    %
                  </span>
                </p>
              </h2>
              <p className="text-sm text-gray-syn4 mt-2">
                {floatedNumberWithCommas(
                  parseFloat(totalDeposits.toString()) *
                    parseFloat(depositTokenPriceInUSD)
                )}{' '}
                USD
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-syn4 leading-6 pb-2">Remaining</p>
              <h2>
                {remainingDeposits > 0 ? (
                  <NumberTreatment
                    numberValue={`${remainingDeposits || ''}`}
                    nativeDepositToken={nativeDepositToken}
                  />
                ) : (
                  0
                )}
                &nbsp;
                {nativeDepositToken ? 'ETH' : tokenDetails.symbol}
              </h2>
              <p className="text-sm text-gray-syn4 mt-2">
                {floatedNumberWithCommas(
                  parseFloat(remainingDeposits.toString()) *
                    parseFloat(depositTokenPriceInUSD)
                )}{' '}
                USD
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
