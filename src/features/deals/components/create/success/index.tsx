import { getWeiAmount } from '@/utils/conversions';
import {
  LeftBottomCoinIcon,
  LeftMiddleCoinIcon,
  LeftTopCoinIcon,
  RightBottomCoinIcon,
  RightMiddleCoinIcon,
  RightTopCoinIcon
} from '../../icons/coins';
import { DealsOverview } from '../../overview';
import { AppState } from '@/state';
import { useSelector } from 'react-redux';

interface Props {
  dealName: string;
  dealDetails: string;
  ensName?: string;
  destinationAddress: string;
  commitmentGoalAmount: string;
  commitmentGoalTokenSymbol: string;
  commitmentGoalTokenLogo: string;
  dealURL?: string;
  isExecutingDeal?: boolean;
}

export const DealsOverviewSuccess: React.FC<Props> = ({
  dealName,
  dealDetails,
  ensName,
  destinationAddress,
  commitmentGoalAmount,
  commitmentGoalTokenSymbol,
  commitmentGoalTokenLogo,
  dealURL,
  isExecutingDeal
}) => {
  const {
    web3Reducer: {
      web3: { web3 }
    }
  } = useSelector((state: AppState) => state);
  const coinSideWidth = '290px';
  const dealCardPaddingTailwindUnit = 8;
  return (
    <a
      href={dealURL}
      className={`block relative mx-auto p-${dealCardPaddingTailwindUnit} bg-black border border-gray-syn6 rounded-custom`}
      style={{
        width: `calc(100% - ${coinSideWidth})`,
        maxWidth: '730px'
      }}
    >
      <DealsOverview
        dealName={dealName}
        dealDetails={dealDetails}
        ensName={ensName}
        destinationAddress={destinationAddress}
        commitmentGoalAmount={getWeiAmount(web3, commitmentGoalAmount, 6, true)}
        commitmentGoalTokenSymbol={commitmentGoalTokenSymbol}
        commitmentGoalTokenLogo={commitmentGoalTokenLogo}
        isExecutingDeal={isExecutingDeal}
      />

      {/* Flying coins */}
      <div className="absolute left-0 top-0 h-full w-full animate-fade_in_double">
        <div
          className={`absolute left-0 top-0 transform -translate-x-full h-full`}
          style={{
            width: `calc(${coinSideWidth} / 2)`
          }}
        >
          <div className="vertically-center space-y-4 flex flex-col items-center">
            <div className="relative -left-4">
              <div className="relative animate-deal-coin-top-left">
                <LeftTopCoinIcon />
              </div>
            </div>
            <div className="relative left-4">
              <div className="relative animate-deal-coin-middle-left">
                <LeftMiddleCoinIcon />
              </div>
            </div>
            <div className="relative -left-4">
              <div className="relative animate-deal-coin-bottom-left">
                <LeftBottomCoinIcon />
              </div>
            </div>
          </div>
        </div>
        <div
          className={`absolute right-0 top-0 transform translate-x-full h-full`}
          style={{
            width: `calc(${coinSideWidth} / 2)`
          }}
        >
          <div className="vertically-center space-y-4 flex flex-col items-center">
            <div className="relative left-4">
              <div className="relative animate-deal-coin-top-right">
                <RightTopCoinIcon />
              </div>
            </div>
            <div className="relative -left-4">
              <div className="relative animate-deal-coin-middle-right">
                <RightMiddleCoinIcon />
              </div>
            </div>
            <div className="relative left-4">
              <div className="relative animate-deal-coin-bottom-right">
                <RightBottomCoinIcon />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chain icon */}
      <img
        src="/images/link-chain-gray.svg"
        alt="Link icon"
        className={`absolute right-4 top-4 w-4 h-4 ${
          dealURL ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </a>
  );
};
