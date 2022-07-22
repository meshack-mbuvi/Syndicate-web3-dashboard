import {
  ClaimCollectivePass,
  WalletState
} from '@/components/collectives/claimCollectivePass';
import { CollectivesInteractiveBackground } from '@/components/collectives/interactiveBackground';
import { NFTMediaType } from '@/components/collectives/nftPreviewer';
import { ShareSocialModal } from '@/components/distributions/shareSocialModal';
import { ProgressState } from '@/components/progressCard';
import { SkeletonLoader } from '@/components/skeletonLoader';
import { AppState } from '@/state';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const NftClaimAndInfoCard: React.FC = () => {
  const {
    web3Reducer: {
      web3: { account }
    }
  } = useSelector((state: AppState) => state);
  // TODO: to fetch loading state from redux store
  const loading = false;

  // TODO: check wallet account eligibility here
  const isAccountEligible = true;
  // TODO: add check for whether account has reached max passes
  const hasAccountReachedMaxPasses = false;

  const [walletState, setWalletState] = useState<WalletState>(
    WalletState.NOT_CONNECTED
  );

  const [transactionHash, setTransactionHash] = useState(
    '0x5e3d4545afda8da89a6da42ec4793fd3c4b45972290ba45b83d095337880d796'
  );

  // monitor claim progress state
  const [progressState, setProgressState] = useState<ProgressState>();

  useEffect(() => {
    let _walletState = WalletState.NOT_CONNECTED;
    if (!account) {
      _walletState = WalletState.NOT_CONNECTED;
    } else {
      if (!isAccountEligible) {
        _walletState = WalletState.WRONG_WALLET;
      } else if (hasAccountReachedMaxPasses) {
        _walletState = WalletState.MAX_PASSES_REACHED;
      } else {
        _walletState = WalletState.CONNECTED;
      }
    }

    // check whether connected account can claim and update _walletState
    setWalletState(_walletState);
  }, [account]);

  const handleViewOnEtherscan = () => {
    /// handle view on etherscan
  };

  const shareUrl = window.location.href;

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
            walletState={walletState}
            progressState={progressState}
            transactionHash={transactionHash}
          />
        )}
      </div>

      <ShareSocialModal
        isModalVisible={progressState === ProgressState.SUCCESS}
        handleModalClose={() => null}
        transactionHash={transactionHash}
        socialURL={shareUrl}
        description={`Just joined Alpha Beta Punks (✺ABP) by claiming the collective’s NFT on Syndicate 🎉 `}
        handleClick={handleViewOnEtherscan}
        customVisual={
          <div className="bg-black w-full h-full">
            <CollectivesInteractiveBackground
              heightClass="h-full"
              widthClass="w-full"
              mediaType={NFTMediaType.IMAGE}
              floatingIcon="https://lh3.googleusercontent.com/kGd5K1UPnRVe2k_3na9U5IKsAKr2ERGHn6iSQwQBPGywEMcRWiKtFmUh85nuG0tBPKLVqaXsWqHKCEJidwa2w4oUgcITcJ7Kh-ObsA"
              numberOfParticles={75}
              isDuplicate={true}
            />
          </div>
        }
        title={'Welcome, Alpha Beta Punks #2001.'}
        buttonLabel={
          <div className="flex justify-center space-x-2">
            <div>View on OpenSea</div>
            <img src="/images/nftClaim/opensea-black.svg" alt="Opensea" />
          </div>
        }
      />
    </div>
  );
};

export default NftClaimAndInfoCard;
