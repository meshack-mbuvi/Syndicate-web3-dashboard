import { SkeletonLoader } from '@/components/skeletonLoader';
import {
  ClaimCollectivePass,
  WalletState
} from '@/components/collectives/claimCollectivePass';
import { useSelector } from 'react-redux';
import { AppState } from '@/state';

const NftClaimAndInfoCard: React.FC = () => {
  const {
    web3Reducer: {
      web3: { account }
    }
  } = useSelector((state: AppState) => state);
  // TODO: to fetch loading state from redux store
  const loading = false;

  // TODO: check wallet account eligibility here
  const isAccountEligible = false;

  // TODO: add check for whether account has reached max passes
  const hasAccountReachedMaxPasses = false;
  return (
    <div className="flex items-center justify-start w-full sm:w-6/12">
      <div className="w-full">
        {loading ? (
          <div className="space-y-12">
            <div className="space-y-2">
              <SkeletonLoader width="48" height="4" />
              <div className="flex space-x-4 items-center">
                <SkeletonLoader width="64" height="8" />
                <div className="flex space-x-4">
                  <SkeletonLoader
                    width="8"
                    height="8"
                    borderRadius="rounded-full"
                  />
                  <SkeletonLoader
                    width="8"
                    height="8"
                    borderRadius="rounded-full"
                  />
                </div>
              </div>
              <SkeletonLoader width="56" height="4" />
            </div>
            <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-6 sm:space-y-0">
              <div className="space-y-2">
                <SkeletonLoader width="48" height="4" />
                <SkeletonLoader width="56" height="8" />
              </div>
              <div className="space-y-2">
                <SkeletonLoader width="48" height="4" />
                <SkeletonLoader width="56" height="8" />
              </div>
            </div>
            <div className="bg-gray-syn8 rounded-2.5xl px-8 py-10 flex justify-center max-w-480">
              <div className="space-y-10 flex flex-col justify-center w-full">
                <div className="flex justify-center w-full">
                  <SkeletonLoader width="64" height="4" />
                </div>
                <SkeletonLoader width="full" height="12" />
              </div>
            </div>
          </div>
        ) : (
          <ClaimCollectivePass
            dateOfCreation="Apr 20, 2022"
            nameOfCollective="Alpha Beta Punks"
            nameOfCreator="0x1a2b...3c4d"
            links={{
              externalLink: '/',
              openSea: '/'
            }}
            numberOfExistingMembers={8000}
            priceToJoin={{
              fiatAmount: 141.78,
              tokenAmount: 0.08,
              tokenSymbol: 'ETH'
            }}
            remainingPasses={2000}
            walletState={
              !account
                ? WalletState.NOT_CONNECTED
                : !isAccountEligible
                ? WalletState.WRONG_WALLET
                : hasAccountReachedMaxPasses
                ? WalletState.MAX_PASSES_REACHED
                : WalletState.CONNECTED
            }
          />
        )}
      </div>
    </div>
  );
};

export default NftClaimAndInfoCard;
