import { FC, useState } from "react";
import { web3 } from "@/utils/web3Utils";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import { SkeletonLoader } from "@/components/skeletonLoader";
import { AppState } from "@/state";
import { fetchCollectiblesTransactions } from "@/state/assets/slice";
import CollectibleDetailsModal from "@/containers/layoutWithSyndicateDetails/assets/collectibles/collectibleDetailsModal";

import CollectibleMedia from "@/containers/layoutWithSyndicateDetails/assets/collectibles/shared/CollectibleMedia";
import { floatedNumberWithCommas } from "@/utils/formattedNumbers";
import {
  setCollectibleModalDetails,
  setShowCollectibleModal,
} from "@/state/assets/collectibles/slice";
import { useDemoMode } from "@/hooks/useDemoMode";
import FullScreenOverlay from "@/containers/layoutWithSyndicateDetails/assets/collectibles/shared/FullscreenOverlay";

const Collectibles: FC = () => {
  const {
    assetsSliceReducer: {
      collectiblesResult,
      allCollectiblesFetched,
      nativeTokenPrice,
      loading
    },
    web3Reducer: {
      web3: { activeNetwork }
    },
    erc20TokenSliceReducer: {
      erc20Token,
      depositDetails: { nativeDepositToken },
      depositTokenPriceInUSD
    }
  } = useSelector((state: AppState) => state);
  const isDemoMode = useDemoMode();

  const dispatch = useDispatch();
  const [pageOffSet, setPageOffSet] = useState<number>(20);

  const collectiblesTitle = (
    <div className="flex items-center space-x-4 pb-8">
      <img src="/images/collectibles.svg" alt="Collectibles" />
      <div className="text-xl">Collectibles</div>
    </div>
  );

  const { maxTotalDeposits } = erc20Token;

  // loading/empty state for collectibles
  const LoaderContent: React.FC<{ animate: boolean }> = ({ animate }) => (
    <div className={`${collectiblesResult.length > 0 && 'pt-6'}`}>
      <div className="relative">
        {!animate && (
          <div className="absolute flex flex-col justify-center items-center top-1/3 w-full z-10">
            <span className="text-white mb-4 text-xl">
              This club has no collectibles yet.
            </span>
            <span className="text-gray-syn4">
              Any NFTs held in this club’s wallet will appear here.
            </span>
          </div>
        )}
        <div
          className={`grid grid-cols-12 gap-5 ${
            !animate && `filter grayscale blur-md`
          }`}
        >
          {[...Array(4)].map((_, idx) => (
            <div key={idx} className="col-span-5 md:col-span-3 xl:col-span-3">
              <>
                <div className="w-full">
                  <SkeletonLoader
                    borderRadius="rounded-t-2.5xl"
                    width="full"
                    height="full"
                    customClass="border-r-1 border-l-1 border-t-1 border-gray-syn6 perfect-square-box"
                    margin="m-0"
                    animate={animate}
                  />
                  <div className="rounded-b-2.5xl w-full p-7 border-b-1 border-r-1 border-l-1 border-gray-syn6">
                    <div className="pb-4">
                      <SkeletonLoader
                        width="full"
                        height="6"
                        margin="m-0"
                        borderRadius="rounded-lg"
                        animate={animate}
                      />
                    </div>
                    <SkeletonLoader
                      width="16"
                      height="4"
                      margin="m-0"
                      borderRadius="rounded-lg"
                      animate={animate}
                    />
                    <div className="pt-2">
                      <SkeletonLoader
                        width="32"
                        height="5"
                        margin="m-0"
                        borderRadius="rounded-lg"
                        animate={animate}
                      />
                    </div>
                  </div>
                </div>
              </>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // fetch more collectibles
  const fetchMoreCollectibles = () => {
    if (isDemoMode) return;
    setPageOffSet(pageOffSet + 20);
    dispatch(
      fetchCollectiblesTransactions({
        account: erc20Token.owner,
        offset: pageOffSet.toString(),
        chainId: activeNetwork.chainId,
        maxTotalDeposits: nativeDepositToken
          ? parseInt((depositTokenPriceInUSD * maxTotalDeposits).toString())
          : maxTotalDeposits
      })
    );
  };

  // loading state.
  if (loading) {
    return (
      <>
        {collectiblesTitle}
        <LoaderContent animate={true} />
      </>
    );
  }

  // empty state
  if (!loading && !collectiblesResult.length) {
    return (
      <>
        {collectiblesTitle}
        <LoaderContent animate={false} />
      </>
    );
  }

  const setDetailsOfSelectedCollectible = (details: {
    collectible: {
      id: string;
      name: string;
      animation: string;
      image: string;
      description: string;
      collection: any;
      permalink: string;
    };
    mediaType: string;
    moreDetails: {
      'Token ID': string;
      'Token collection': any;
      'Floor price': any;
      'Last purchase price': any;
    };
  }): void => {
    dispatch(setCollectibleModalDetails(details));
    dispatch(setShowCollectibleModal(true));
  };

  return (
    <div className="w-full">
      {collectiblesResult.length > 0 && (
        <div>
          {collectiblesTitle}
          <InfiniteScroll
            dataLength={collectiblesResult.length}
            next={fetchMoreCollectibles}
            hasMore={!allCollectiblesFetched}
            loader={!isDemoMode && <LoaderContent animate={true} />}
          >
            <div className="grid grid-cols-12 gap-5">
              {collectiblesResult.map((collectible, index) => {
                const {
                  id,
                  image,
                  name,
                  animation,
                  floorPrice,
                  lastPurchasePrice,
                  collection,
                  futureNft
                } = collectible;

                let mediaType;

                if (image && !animation) {
                  mediaType = 'imageOnlyNFT';
                } else if (animation) {
                  // animation could be a .mov or .mp4 video
                  const movAnimation = animation.match(/\.mov$/) != null;
                  const mp4Animation = animation.match(/\.mp4$/) != null;

                  if (movAnimation || mp4Animation) {
                    mediaType = 'videoNFT';
                  }

                  // https://litwtf.mypinata.cloud/ipfs/QmVjgAD5gaNQ1cLpgKLeuXDPX8R1yeajtWUhM6nV7VAe6e/4.mp4
                  // details for the nft with id below are not returned correctly and hence does not render
                  // The animation link is a .html which is not captured.
                  // Until we find a better way to handle this, let's have the fix below
                  if (animation.match(/\.html$/) != null && id == '3216') {
                    mediaType = 'htmlNFT';
                  }

                  // animation could be a gif
                  if (animation.match(/\.gif$/) != null) {
                    mediaType = 'animatedNFT';
                  }

                  // add support for .wav and .mp3 files
                  const wavAnimation = animation.match(/\.wav$/) != null;
                  const mp3Animation = animation.match(/\.mp3$/) != null;
                  const soundtrack = wavAnimation || mp3Animation;

                  if (soundtrack) {
                    mediaType = 'soundtrackNFT';
                  }
                }

                // sometimes the NFT name is an Ethereum address
                // we need to break this to fit onto the collectible card
                const isNameEthereumAddress = web3.utils.isAddress(name);

                const blankValue = <span className="text-gray-syn4">-</span>;

                if (mediaType) {
                  return (
                    <div
                      className="col-span-12 sm:col-span-6 md:col-span-4 xl:col-span-3 cursor-pointer"
                      key={index}
                    >
                      <CollectibleMedia
                        {...{
                          collectible,
                          mediaType,
                          setDetailsOfSelectedCollectible,
                          showCollectibles: true
                        }}
                      />

                      <FullScreenOverlay />
                      <div
                        className="flex rounded-b-2.5xl py-6 border-b-1 border-r-1 border-l-1 border-gray-syn6 h-36"
                        onClick={() => {
                          setDetailsOfSelectedCollectible({
                            collectible,
                            mediaType,
                            moreDetails: {
                              'Token ID': futureNft ? '' : id,
                              'Token collection': collection.name,
                              'Floor price': floorPrice,
                              'Last purchase price': lastPurchasePrice
                            }
                          });
                        }}
                      >
                        <div className="mx-8 flex flex-col">
                          <span
                            className={`line-clamp-1 text-xl ${
                              isNameEthereumAddress
                                ? 'break-all'
                                : 'break-words'
                            }`}
                          >
                            {name ? name : blankValue}
                          </span>
                          <span className="text-gray-syn4 text-sm pt-4">
                            Floor price
                          </span>
                          <div className="space-x-2 pt-1 h-1/3 overflow-y-scroll no-scroll-bar">
                            <span className="">
                              {floorPrice
                                ? `${floorPrice} ${activeNetwork.nativeCurrency.symbol}`
                                : blankValue}
                            </span>
                            {floorPrice > 0 && (
                              <span className="text-gray-syn4">
                                (
                                {floatedNumberWithCommas(
                                  floorPrice * nativeTokenPrice
                                )}{' '}
                                USD)
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          </InfiniteScroll>
        </div>
      )}
      <CollectibleDetailsModal />
    </div>
  );
};

export default Collectibles;
