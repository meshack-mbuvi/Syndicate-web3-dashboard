import { utils } from 'ethers';
import { NativeTokenPriceMerkleMintModule } from '@/ClubERC20Factory/NativeTokenPriceMerkleMintModule';
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
import MintModuleHarness from '@/components/mintModules/MintModuleHarness';
import NativeTokenPriceMerkleMintModuleHarness from '@/components/mintModules/NativeTokenPriceMerkleMintModuleHarness';
import { ProgressState } from '@/components/progressCard';
import { SkeletonLoader } from '@/components/skeletonLoader';
import useFetchCollectiveMetadata from '@/hooks/collectives/create/useFetchNftMetadata';
import useERC721Collective from '@/hooks/collectives/useERC721Collective';
import { AppState } from '@/state';
import { getOpenSeaLink } from '@/utils/api/nfts';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { formatUnix } from 'src/utils/dateUtils';
import { useApolloClient } from '@apollo/client';
import useGasEstimate from '@/hooks/useGasEstimate';
import { CONTRACT_ADDRESSES } from '@/Networks';

// TODO: REMOVE AFTER RR PFP LAUNCH
const NftClaimAndInfoCard: React.FC<{
  merkleMintModule: NativeTokenPriceMerkleMintModule;
}> = ({ merkleMintModule }) => {
  const {
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

  const apolloClient = useApolloClient();

  // TODO: Make this better
  const collectiveAddress =
    '0xc28313a1080322cD4a23A89b71Ba5632D1Fc8962'.toLowerCase();
  const isCoreyVanLew =
    merkleMintModule.address.toLowerCase() ===
    CONTRACT_ADDRESSES[
      chainId || 1
    ].nativeTokenPriceMerkleMintModule_copy2.toLowerCase();

  const {
    collectiveDetails: {
      //   mintPrice,
      maxTotalSupply,
      totalSupply,
      collectiveSymbol,
      collectiveName,
      createdAt,
      ownerAddress,
      //   collectiveAddress,
      numOwners,
      metadataCid
    },
    collectiveDetailsLoading
  } = useERC721Collective();

  const mintModule: MintModuleHarness = useMemo(() => {
    return new NativeTokenPriceMerkleMintModuleHarness(
      collectiveAddress,
      merkleMintModule,
      apolloClient
    );
  }, [account, merkleMintModule, apolloClient]);

  const [args, setArgs] = useState<any[]>([]);
  useEffect(() => {
    if (mintModule.args) {
      void mintModule.args(account).then((res) => {
        if (isCoreyVanLew) {
          res[2] = 5;
          setArgs(res);
        } else {
          setArgs(res);
        }
      });
    }
  }, []);

  const { data: gasEstimateData, isLoading: isGasEstimateLoading } =
    useGasEstimate({
      contract: merkleMintModule,
      functionName: 'mint',
      args,
      value: '0',
      withFiat: true
    });

  const gasEstimate = gasEstimateData?.gasEstimate;

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

  const onTxConfirm = (hash: string): void => {
    setProgressState(ProgressState.PENDING);
    setTransactionHash(hash);
  };

  const onTxReceipt = (): void => {
    setProgressState(ProgressState.SUCCESS);
    amplitudeLogger(COLLECTIVE_CLAIM, {
      flow: Flow.COLLECTIVE_CLAIM,
      transaction_status: 'Success'
    });
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
    console.log('the mint module to use for minting', mintModule);
    try {
      (await mintModule).mint(
        collectiveAddress,
        account,
        onTxConfirm,
        onTxReceipt,
        onTxFail,
        isCoreyVanLew ? '5' : '1'
      );
    } catch (error) {
      onTxFail(error);
    }
  };

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
      gasEstimateData?.isValidTx;
      _walletState = gasEstimateData?.isValidTx
        ? WalletState.ELIGIBLE
        : WalletState.NOT_ELIGIBLE;
    }

    // check whether connected account can claim and update _walletState
    setWalletState(_walletState);
  }, [account, gasEstimateData?.isValidTx]);

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

  const isDataLoading =
    collectiveDetailsLoading || (account && isGasEstimateLoading);

  return (
    <div className="flex items-center justify-start w-full sm:w-6/12">
      <div className="w-full">
        {isDataLoading ? (
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
              fiatAmount: 0,
              tokenAmount: 0,
              tokenSymbol: ''
            }}
            gasEstimate={
              gasEstimate
                ? {
                    fiatAmount: gasEstimate?.gasEstimateCostInUSD,
                    tokenAmount: Number(
                      utils.formatUnits(
                        utils.parseUnits(
                          gasEstimate?.gasEstimateCostInGwei,
                          'gwei'
                        ),
                        'ether'
                      )
                    ),
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
