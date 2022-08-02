import {
  ClaimCollectivePass,
  WalletState
} from '@/components/collectives/claimCollectivePass';
import { CollectivesInteractiveBackground } from '@/components/collectives/interactiveBackground';
import { NFTMediaType } from '@/components/collectives/nftPreviewer';
import { ShareSocialModal } from '@/components/distributions/shareSocialModal';
import { ProgressState } from '@/components/progressCard';
import { SkeletonLoader } from '@/components/skeletonLoader';
import useCollectiveClaimDetails from '@/hooks/useCollectiveClaimDetails';
import { AppState } from '@/state';
import { formatUnix } from 'src/utils/dateUtils';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getWeiAmount } from '@/utils/conversions';
import { getCollectiveBalance } from '@/utils/contracts/collective';
import useGasDetails from '@/hooks/useGasDetails';

const NftClaimAndInfoCard: React.FC = () => {
  const {
    initializeContractsReducer: { syndicateContracts },
    web3Reducer: {
      web3: {
        account,
        web3,
        activeNetwork: {
          nativeCurrency: { symbol }
        }
      }
    },
    erc721CollectiveReducer: { erc721Collective },
    gasDetailsSlice: {
      gasDetails: { gasMultipler, nativeTokenPrice }
    }
  } = useSelector((state: AppState) => state);

  const {
    contractAddress,
    ownerAddress,
    createdAt,
    tokenName,
    tokenSymbol,
    priceEth,
    totalSupply,
    totalUnclaimed,
    maxTotalSupply,
    maxPerMember,
    numOwners
  } = erc721Collective;
  const collectivePrice = getWeiAmount(web3, priceEth.toString(), 18, false);

  const { loading } = useCollectiveClaimDetails();
  useGasDetails();

  const [isAccountEligible, setIsAccountEligible] = useState(true);
  const [hasAccountReachedMaxPasses, setHasAccountReachedMaxPasses] =
    useState(false);

  const [gasUnits, setGasUnits] = useState(0);
  const [gasPrice, setGasPrice] = useState<number>(0);

  const [walletState, setWalletState] = useState<WalletState>(
    WalletState.NOT_CONNECTED
  );

  const [transactionHash, setTransactionHash] = useState('');
  const [progressState, setProgressState] = useState<ProgressState>();

  const onTxConfirm = (hash: string) => {
    setProgressState(ProgressState.PENDING);
    setTransactionHash(hash);
  };

  const onTxReceipt = () => {
    setProgressState(ProgressState.SUCCESS);
  };

  const onTxFail = () => {
    setProgressState(ProgressState.FAILURE);
  };

  const claimCollective = async () => {
    setProgressState(ProgressState.CONFIRM);
    try {
      const { ethPriceMintModule } = syndicateContracts;
      await ethPriceMintModule.mint(
        priceEth.toString(),
        contractAddress,
        '1', // Hardcode to mint a single token
        account,
        onTxConfirm,
        onTxReceipt,
        onTxFail
      );
    } catch (error) {
      setProgressState(ProgressState.FAILURE);
    }
  };

  useEffect(() => {
    getCollectiveBalance(contractAddress, account, web3).then((balance) => {
      setHasAccountReachedMaxPasses(balance >= maxPerMember);
    });
  }, [account, contractAddress, maxPerMember, web3]);

  useEffect(() => {
    setIsAccountEligible(+maxTotalSupply > +totalSupply);
  }, [maxTotalSupply, totalSupply]);

  useEffect(() => {
    if (!gasUnits || !gasMultipler) return;
    const estimatedGasInWei = gasUnits * gasMultipler;
    const estimatedGas = getWeiAmount(
      web3,
      estimatedGasInWei.toString(),
      18,
      false
    );
    setGasPrice(+estimatedGas);
  }, [gasUnits, gasMultipler, web3]);

  useEffect(() => {
    if (loading) return;
    syndicateContracts.ethPriceMintModule.getMintEstimateGas(
      priceEth.toString(),
      contractAddress,
      '1', // Hardcode to mint a single token
      account,
      setGasUnits
    );
  }, [loading, account, contractAddress, priceEth, syndicateContracts]);

  useEffect(() => {
    let _walletState = WalletState.NOT_CONNECTED;
    if (!account) {
      _walletState = WalletState.NOT_CONNECTED;
    } else {
      if (hasAccountReachedMaxPasses) {
        _walletState = WalletState.MAX_PASSES_REACHED;
      } else if (!isAccountEligible) {
        _walletState = WalletState.WRONG_WALLET;
      } else {
        _walletState = WalletState.CONNECTED;
      }
    }

    // check whether connected account can claim and update _walletState
    setWalletState(_walletState);
  }, [account, isAccountEligible]);

  const handleViewOnEtherscan = () => {
    /// handle view on etherscan
  };

  const shortenOwnerAddress = (address: string) => {
    const addr = address.toLowerCase();
    return addr.substring(0, 6) + '...' + addr.substring(addr.length - 4);
  };

  const shareUrl = window.location.href; // TODO: Use open sea link

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
            dateOfCreation={formatUnix(createdAt, 'MMM D, yyyy')}
            nameOfCollective={tokenName}
            nameOfCreator={shortenOwnerAddress(ownerAddress)}
            links={{
              externalLink: 'https://etherscan.io/address/' + contractAddress,
              openSea: '/' // TODO: Populate the open sea link
            }}
            numberOfExistingMembers={numOwners}
            priceToJoin={{
              fiatAmount: collectivePrice * nativeTokenPrice,
              tokenAmount: collectivePrice,
              tokenSymbol: symbol
            }}
            gasEstimate={
              gasPrice
                ? {
                    fiatAmount: gasPrice * nativeTokenPrice,
                    tokenAmount: gasPrice,
                    tokenSymbol: symbol
                  }
                : null
            }
            maxTotalPasses={maxTotalSupply}
            remainingPasses={totalUnclaimed}
            walletState={walletState}
            progressState={progressState}
            transactionHash={transactionHash}
            transactionType="transaction"
            claimCollective={claimCollective}
            tryAgain={() => {
              setProgressState(null);
            }}
          />
        )}
      </div>

      <ShareSocialModal
        isModalVisible={progressState === ProgressState.SUCCESS}
        handleModalClose={() => null}
        transactionHash={transactionHash}
        socialURL={shareUrl}
        description={`Just joined ${tokenName} (${tokenSymbol}) by claiming the collective’s NFT on Syndicate 🎉 `}
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
        title={`Welcome, ${tokenName} #${+totalSupply + 1}.`}
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
