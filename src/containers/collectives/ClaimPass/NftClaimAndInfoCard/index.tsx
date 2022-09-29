import { amplitudeLogger, Flow } from '@/components/amplitude';
import {
  CLAIM_TRY_AGAIN_CLICK,
  COLLECTIVE_CLAIM,
  VIEW_COLLECTIVE_CLICK
} from '@/components/amplitude/eventNames';
import {
  ClaimCollectivePass,
  WalletState
} from '@/components/collectives/claimCollectivePass';
import { CollectivesInteractiveBackground } from '@/components/collectives/interactiveBackground';
import { NFTMediaType } from '@/components/collectives/nftPreviewer';
import { ShareSocialModal } from '@/components/distributions/shareSocialModal';
import { ProgressState } from '@/components/progressCard';
import { SkeletonLoader } from '@/components/skeletonLoader';
import useFetchCollectiveMetadata from '@/hooks/collectives/create/useFetchNftMetadata';
import useERC721Collective from '@/hooks/collectives/useERC721Collective';
import useGasDetails, { ContractMapper } from '@/hooks/useGasDetails';
import { AppState } from '@/state';
import { getOpenSeaLink } from '@/utils/api/nfts';
import { getCollectiveBalance } from '@/utils/contracts/collective';
import { getWeiAmount } from '@/utils/conversions';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { formatUnix } from 'src/utils/dateUtils';

const NftClaimAndInfoCard: React.FC = () => {
  const {
    initializeContractsReducer: { syndicateContracts },
    web3Reducer: {
      web3: {
        account,
        web3,
        activeNetwork: {
          chainId,
          nativeCurrency: { symbol },
          blockExplorer: { baseUrl }
        }
      }
    }
  } = useSelector((state: AppState) => state);

  const {
    collectiveDetails: {
      mintPrice,
      maxTotalSupply,
      totalSupply,
      collectiveSymbol,
      collectiveName,
      createdAt,
      ownerAddress,
      collectiveAddress,
      numOwners,
      maxPerWallet,
      metadataCid
    },
    collectiveDetailsLoading
  } = useERC721Collective();

  const {
    gas: gasPrice,
    fiatAmount,
    nativeTokenPrice
  } = useGasDetails({
    contract: ContractMapper.EthPriceMintModuleMint,
    withFiatCurrency: true,
    args: {
      mintPrice,
      collectiveAddress
    },
    skipQuery: !mintPrice || !collectiveAddress
  });

  const [isAccountEligible, setIsAccountEligible] = useState(true);
  const [hasAccountReachedMaxPasses, setHasAccountReachedMaxPasses] =
    useState(false);
  const [interval, setIntervalId] = useState(null);

  const { data: nftMetadata } = useFetchCollectiveMetadata(metadataCid);
  const ipfsGateway = process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL;

  const [walletState, setWalletState] = useState<WalletState>(
    WalletState.NOT_CONNECTED
  );

  const [transactionHash, setTransactionHash] = useState('');
  const [progressState, setProgressState] = useState<ProgressState>();
  const [openSeaLink, setOpenSeaLink] = useState<string>();

  useEffect(() => {
    if (progressState == ProgressState.TAKING_LONG || !interval) return;

    clearInterval(interval);

    return () => {
      clearInterval(interval);
    };
  }, [progressState, interval]);

  const onTxConfirm = (hash: string) => {
    setProgressState(ProgressState.PENDING);
    setTransactionHash(hash);
  };

  const onTxReceipt = () => {
    setProgressState(ProgressState.SUCCESS);
  };

  const onTxFail = (error: any) => {
    if (error?.message.includes('Be aware that it might still be mined')) {
      // Pool for account nft balance
      const interval = setInterval(() => {
        web3.eth
          .getTransactionReceipt(transactionHash)
          .then((transaction: any) => {
            if (!transaction) return;

            if (transaction.status) {
              setProgressState(ProgressState.SUCCESS);
            } else {
              setProgressState(ProgressState.FAILURE);
            }
          });
      }, 2000);

      // @ts-expect-error TS(2345): Argument of type 'Timeout' is not assignable to par is not assig... Remove this comment to see the full error message
      setIntervalId(interval);

      setProgressState(ProgressState.TAKING_LONG);
      amplitudeLogger(COLLECTIVE_CLAIM, {
        flow: Flow.COLLECTIVE_CLAIM,
        transaction_status: 'Transaction taking longer than expected'
      });
    } else {
      setProgressState(ProgressState.FAILURE);
      amplitudeLogger(COLLECTIVE_CLAIM, {
        flow: Flow.COLLECTIVE_CLAIM,
        transaction_status: 'Failure'
      });
    }
  };

  const claimCollective = async () => {
    setProgressState(ProgressState.CONFIRM);
    try {
      const { ethPriceMintModule } = syndicateContracts;
      await ethPriceMintModule.mint(
        getWeiAmount(web3, mintPrice, 18, true),
        collectiveAddress,
        '1', // Hardcode to mint a single token
        account,
        onTxConfirm,
        onTxReceipt,
        onTxFail
      );
      amplitudeLogger(COLLECTIVE_CLAIM, {
        flow: Flow.COLLECTIVE_CLAIM,
        transaction_status: 'Success'
      });
    } catch (error) {
      onTxFail(error);
    }
  };

  useEffect(() => {
    getCollectiveBalance(collectiveAddress, account, web3).then((balance) => {
      setHasAccountReachedMaxPasses(balance >= +maxPerWallet);
    });
  }, [account, collectiveAddress, maxPerWallet, web3, progressState]);

  useEffect(() => {
    if (+maxTotalSupply > 0) {
      setIsAccountEligible(+maxTotalSupply > +totalSupply);
    } else {
      setIsAccountEligible(true);
    }
  }, [maxTotalSupply, totalSupply]);

  useEffect(() => {
    if (collectiveDetailsLoading) return;
    getOpenSeaLink(collectiveAddress, chainId).then((link: string) => {
      setOpenSeaLink(link);
    });
  }, [collectiveDetailsLoading, collectiveAddress, chainId]);

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
  }, [account, isAccountEligible, hasAccountReachedMaxPasses]);

  const shortenOwnerAddress = (address: string) => {
    if (!address) return '';
    const addr = address.toLowerCase();
    return addr.substring(0, 6) + '...' + addr.substring(addr.length - 4);
  };

  const shareUrl = window.location.href;

  // open the collective details page
  const handleClick = () => {
    window.location.pathname = `/collectives/${collectiveAddress}`;
    amplitudeLogger(VIEW_COLLECTIVE_CLICK, {
      flow: Flow.COLLECTIVE_CLAIM
    });
  };

  // Close modal on outside click
  const handleModalClose = () => {
    // @ts-expect-error TS(2345): Argument of type 'null' is not assignable to par... Remove this comment to see the full error message
    setProgressState(null);
  };

  return (
    <div className="flex items-center justify-start w-full sm:w-6/12">
      <div className="w-full">
        {collectiveDetailsLoading ? (
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
            dateOfCreation={formatUnix(+createdAt, 'MMM D, yyyy')}
            nameOfCollective={collectiveName}
            nameOfCreator={shortenOwnerAddress(ownerAddress)}
            links={{
              externalLink: `${baseUrl}/address/${collectiveAddress}`,
              // @ts-expect-error TS(2322): Type 'string | undefined' is not assignable to type 'string'.
              openSea: openSeaLink
            }}
            numberOfExistingMembers={+numOwners}
            priceToJoin={{
              fiatAmount: +mintPrice * nativeTokenPrice,
              tokenAmount: +mintPrice,
              tokenSymbol: symbol
            }}
            //@ts-expect-error TS(2322): Type '{ fiatAmount: number; tokenAmount: number; tokenSymbol: string; } | null' is not
            gasEstimate={
              gasPrice
                ? {
                    fiatAmount: +fiatAmount,
                    tokenAmount: gasPrice,
                    tokenSymbol: symbol
                  }
                : null
            }
            maxTotalPasses={+maxTotalSupply}
            remainingPasses={
              +maxTotalSupply ? +maxTotalSupply - +totalSupply : 0
            }
            walletState={walletState}
            progressState={progressState}
            transactionHash={transactionHash}
            transactionType="transaction"
            claimCollective={claimCollective}
            tryAgain={() => {
              // @ts-expect-error TS(2345): Argument of type 'null' is not assignable to parameter of type
              setProgressState(null);
              amplitudeLogger(CLAIM_TRY_AGAIN_CLICK, {
                flow: Flow.COLLECTIVE_CLAIM
              });
            }}
          />
        )}
      </div>

      <ShareSocialModal
        isModalVisible={progressState === ProgressState.SUCCESS}
        handleModalClose={handleModalClose}
        transactionHash={transactionHash}
        handleClick={handleClick}
        socialURL={shareUrl}
        description={`Just joined ${collectiveName} (${collectiveSymbol}) by claiming the collective’s NFT on Syndicate 🎉 `}
        customVisual={
          <div className="bg-black w-full h-full">
            <CollectivesInteractiveBackground
              heightClass="h-full"
              widthClass="w-full"
              mediaType={
                nftMetadata?.animation_url
                  ? NFTMediaType.VIDEO
                  : nftMetadata?.image
                  ? NFTMediaType.IMAGE
                  : NFTMediaType.CUSTOM
              }
              floatingIcon={
                nftMetadata?.animation_url
                  ? `${ipfsGateway}/${nftMetadata?.animation_url.replace(
                      'ipfs://',
                      ''
                    )}`
                  : // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                    `${ipfsGateway}/${nftMetadata?.image.replace(
                      'ipfs://',
                      ''
                    )}`
              }
              numberOfParticles={75}
              customId="particles-js-2"
            />
          </div>
        }
        title={`Welcome, ${collectiveName} #${+totalSupply + 1}.`}
        buttonLabel={
          <div className="flex justify-center space-x-2">
            <div>View collective</div>
          </div>
        }
      />
    </div>
  );
};

export default NftClaimAndInfoCard;
