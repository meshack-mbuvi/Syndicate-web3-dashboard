// component to show syndicate deposits progress
import { divideIfNotByZero } from '@/utils/conversions';
import { floatedNumberWithCommas } from '@/utils/formattedNumbers';
import { SkeletonLoader } from 'src/components/skeletonLoader';
import useTokenDetails from '@/hooks/useTokenDetails';
import { useEffect, useState } from 'react';
import axios from 'axios';
import NumberTreatment from '@/components/NumberTreatment';

interface IProgressIndicator {
  totalDeposits: number;
  depositTotalMax: string;
  depositERC20TokenSymbol: string;
  openDate: string;
  closeDate: string;
  loading?: boolean;
  nativeDepositToken: boolean;
}
export const ProgressIndicator = (props: IProgressIndicator): JSX.Element => {
  const {
    totalDeposits = 0,
    depositTotalMax,
    depositERC20TokenSymbol,
    loading = false,
    nativeDepositToken = false
  } = props;

  const { depositTokenName } = useTokenDetails(nativeDepositToken);

  const [depositTokenPriceInUSDState, setDepositTokenPriceInUSDState] =
    useState<number>(0);

  useEffect(() => {
    async function getTokenPrice(tokenName) {
      const result = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=${tokenName}&vs_currencies=usd`
      );
      setDepositTokenPriceInUSDState(
        parseFloat(result.data?.[tokenName.toLowerCase()]?.usd?.toFixed(2))
      );
    }
    getTokenPrice(depositTokenName);
  }, [depositTokenName]);

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
                  {depositERC20TokenSymbol}
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
                    depositTokenPriceInUSDState
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
                {depositERC20TokenSymbol}
              </h2>
              <p className="text-sm text-gray-syn4 mt-2">
                {floatedNumberWithCommas(
                  parseFloat(remainingDeposits.toString()) *
                    depositTokenPriceInUSDState
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
