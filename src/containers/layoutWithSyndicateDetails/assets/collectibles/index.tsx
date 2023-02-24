import { SkeletonLoader } from '@/components/skeletonLoader';
import { H4 } from '@/components/typography';
import CollectibleDetailsModal from '@/containers/layoutWithSyndicateDetails/assets/collectibles/collectibleDetailsModal';
import CollectibleMedia from '@/containers/layoutWithSyndicateDetails/assets/collectibles/shared/CollectibleMedia';
import {
  CollapseChevronButton,
  CollapsedSectionType
} from '@/containers/layoutWithSyndicateDetails/assets/shared/CollapseChevronButton';
import { useDemoMode } from '@/hooks/useDemoMode';
import { AppState } from '@/state';
import { fetchCollectiblesTransactions } from '@/state/assets/slice';
import { floatedNumberWithCommas } from '@/utils/formattedNumbers';
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch, useSelector } from 'react-redux';

export interface CollectibleDetails {
  collectible: Collectible;
  mediaType: string;
  moreDetails: {
    'Token ID': string;
    'Token collection': string;
    'Floor price': string;
    'Last purchase price': string;
  };
}

const emptyCollectibleDetails: CollectibleDetails = {
  collectible: {
    id: '',
    assetId: '',
    name: '',
    animation: '',
    image: '',
    description: '',
    collection: {},
    permalink: '',
    floorPrice: '',
    lastPurchasePrice: ''
  },
  mediaType: '',
  moreDetails: {
    'Token ID': '',
    'Token collection': '',
    'Floor price': '',
    'Last purchase price': ''
  }
};

interface Props {
  isOwner: boolean;
  showHiddenNfts: boolean;
  showOrHideNfts: (contractAddress: string) => void;
}

export interface Collectible {
  id: string;
  assetId: string;
  image: string;
  animation: string;
  permalink: string;
  name: string;
  description: string;
  collection: any;
  floorPrice: string;
  lastPurchasePrice: string;
  futureNft?: boolean;
  hidden?: boolean;
}

export const Collectibles: FC<Props> = ({
  isOwner,
  showHiddenNfts,
  showOrHideNfts
}) => {
  const {
    assetsSliceReducer: {
      collectiblesResult,
      allCollectiblesFetched,
      nativeTokenPrice,
      loading
    },
    web3Reducer: {
      web3: { activeNetwork, web3 }
    },
    erc20TokenSliceReducer: {
      erc20Token,
      depositDetails: { nativeDepositToken },
      depositTokenPriceInUSD
    }
  } = useSelector((state: AppState) => state);
  const isDemoMode = useDemoMode();

  const [showFullScreen, setShowFullScreen] = useState(false);
  const [showCollectibleModal, setShowCollectibleModal] = useState(false);

  const nftsGallery = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const [pageOffSet, setPageOffSet] = useState<number>(20);

  // show/hide NFts
  const [isNftsCollapsed, setIsNftsCollapsed] = useState(false);
  const [nftsData, setNftsData] = useState<Collectible[]>(collectiblesResult);
  const [containerHeight, setContainerHeight] = useState<number>(0);

  let clubAddress = '';
  if (typeof window !== 'undefined') {
    clubAddress = window?.location?.pathname.split('/')[2];
  }
  // get height of nfts section to animate on collapse
  const data = useMemo(
    () => (nftsData.length ? JSON.stringify(nftsData) : []),
    [nftsData]
  );
  useEffect(() => {
    if (nftsGallery.current) {
      const containerHeight = nftsGallery.current
        ? nftsGallery.current.getBoundingClientRect().height
        : 0;

      setContainerHeight(containerHeight);
    }
    // added loading as a dependency here because
    // nftsData only doesn't trigger a recalculation of the height.
  }, [data, loading]);

  // get state of nfts section collapsed from localStorage
  useEffect(() => {
    if (window.localStorage) {
      const existingClubsCollapsedStates =
        JSON.parse(
          localStorage.getItem('clubAssetsCollapsedState') as string
        ) || {};

      const currentClubCollapsedState =
        existingClubsCollapsedStates[clubAddress as string] || {};

      const isNftsSectionCollapsed =
        currentClubCollapsedState[CollapsedSectionType.NFTS] || false;

      setIsNftsCollapsed(isNftsSectionCollapsed);
    }
  }, [clubAddress]);

  const collectiblesTitle = (
    <div className="flex w-full justify-between items-center">
      {/* title text  */}
      <div className="flex items-center space-x-4">
        <img src="/images/collectibles.svg" alt="Collectibles" />
        <H4>NFTs</H4>
      </div>

      {/* collapse button  */}
      <CollapseChevronButton
        isCollapsed={isNftsCollapsed}
        setIsCollapsed={setIsNftsCollapsed}
        collapsedSection={CollapsedSectionType.NFTS}
      />
    </div>
  );

  const { maxTotalDeposits } = erc20Token;

  // loading/empty state for collectibles
  const LoaderContent: React.FC<{ animate: boolean }> = ({ animate }) => (
    <div className={`${nftsData.length > 0 && 'pt-6'}`}>
      <div className={`relative ${!animate ? 'px-2' : 'px-0'}`}>
        {!animate && (
          <div className="absolute flex flex-col justify-center items-center top-1/3 w-full z-10">
            <H4 extraClasses="text-white mb-4">This club has no NFTs yet.</H4>
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

  // factor in hidden NFTs
  const getHiddenNfts = useCallback(() => {
    if (window.localStorage) {
      const existingClubsHiddenAssets =
        JSON.parse(localStorage.getItem('hiddenAssets') as string) || {};

      // filter out hidden Nfts
      let filteredPaginatedData, filteredData;
      if (Object.keys(existingClubsHiddenAssets).length) {
        const clubHiddenAssets =
          existingClubsHiddenAssets[clubAddress as string] || [];

        if (clubHiddenAssets.length) {
          filteredData = collectiblesResult.map((data: Collectible) => {
            const { id } = data;

            return {
              ...data,
              hidden: clubHiddenAssets.indexOf(id) > -1
            };
          });

          filteredPaginatedData = collectiblesResult.filter(
            (data: Collectible) => {
              const { id } = data;
              return clubHiddenAssets.indexOf(id) < 0;
            }
          );

          // setting correct data array to use based on whether we need to
          // show hidden tokens or not.
          const nftsDataPostFilter = showHiddenNfts
            ? filteredData
            : filteredPaginatedData;

          setNftsData(nftsDataPostFilter);
        } else {
          setNftsData(collectiblesResult);
        }
      } else {
        setNftsData(collectiblesResult);
      }
    }
  }, [clubAddress, collectiblesResult, showHiddenNfts]);

  useEffect(() => {
    if (collectiblesResult.length) {
      getHiddenNfts();
    }
  }, [
    collectiblesResult,
    clubAddress,
    showOrHideNfts,
    showHiddenNfts,
    getHiddenNfts
  ]);

  // show/hide Nfts
  const showOrHideNftsById = (e: Event, id: string) => {
    e.stopPropagation();
    // show or hide nft based on id
    showOrHideNfts(id);
    // update hidden nfts
    getHiddenNfts();
  };

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
          ? // @ts-expect-error TS(2532): Object is possibly 'undefined'.
            parseInt((depositTokenPriceInUSD * maxTotalDeposits).toString())
          : maxTotalDeposits
      })
    );
  };

  const [selectedCollectibleDetails, setSelectedCollectibleDetails] = useState(
    emptyCollectibleDetails
  );
  const [overlayCollectibleId, setOverlayCollectibleId] = useState('');

  const setDetailsOfSelectedCollectible = (
    details: CollectibleDetails
  ): void => {
    setSelectedCollectibleDetails(details);
    setShowCollectibleModal(true);
  };

  return (
    <div className="w-full h-full">
      <div>
        {collectiblesTitle}
        <div
          className="duration-500 transition-all h-full overflow-hidden"
          style={{
            height: isNftsCollapsed ? '0px' : `${containerHeight}px`
          }}
        >
          <div ref={nftsGallery} className="pt-8">
            {/* loading state  */}
            {loading ? <LoaderContent animate={true} /> : null}

            {/* empty state  */}
            {!loading && !nftsData.length ? (
              <LoaderContent animate={false} />
            ) : null}
            {nftsData.length > 0 && !loading ? (
              <InfiniteScroll
                dataLength={nftsData.length}
                next={fetchMoreCollectibles}
                hasMore={!allCollectiblesFetched}
                loader={!isDemoMode && <LoaderContent animate={true} />}
              >
                <div className="grid grid-cols-12 gap-5">
                  {nftsData.map(
                    (
                      collectible: Collectible,
                      index: number
                    ): React.ReactNode => {
                      const {
                        id,
                        image,
                        name,
                        animation,
                        floorPrice,
                        lastPurchasePrice,
                        collection,
                        futureNft,
                        hidden = false
                      } = collectible;

                      let mediaType = '';

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
                        if (
                          animation.match(/\.html$/) != null &&
                          id == '3216'
                        ) {
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

                        // Still media type not set? Default to imageOnlyNFT
                        if (!mediaType) {
                          mediaType = 'imageOnlyNFT';
                        }
                      }
                      // sometimes the NFT name is an Ethereum address
                      // we need to break this to fit onto the collectible card
                      const isNameEthereumAddress: boolean =
                        web3?.utils?.isAddress(name) || false;

                      const blankValue = (
                        <span className="text-gray-syn4">-</span>
                      );

                      if (mediaType) {
                        return (
                          <div
                            className={`col-span-12 sm:col-span-6 md:col-span-4 xl:col-span-3 cursor-pointer group ${
                              hidden && !showHiddenNfts ? 'hidden' : 'block'
                            } ${
                              hidden ? 'cursor-not-allowed' : 'cursor-pointer '
                            }
                            `}
                            key={index}
                          >
                            {!showFullScreen ? (
                              <CollectibleMedia
                                {...{
                                  collectible,
                                  mediaType,
                                  setDetailsOfSelectedCollectible,
                                  showCollectibles: true,
                                  showHiddenNfts,
                                  showOrHideNfts: showOrHideNftsById,
                                  isOwner,

                                  overlayCollectibleId,
                                  setOverlayCollectibleId,
                                  showCollectibleModal,
                                  showFullScreen,
                                  setShowFullScreen
                                }}
                              />
                            ) : null}
                            <div
                              className={`flex rounded-b-2.5xl py-6 border-b-1 border-r-1 border-l-1 border-gray-syn6 h-36 ${
                                hidden ? 'cursor-not-allowed' : 'cursor-pointer'
                              }`}
                              onClick={() => {
                                // do not show more details if nft's hidden
                                if (hidden) return;
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
                              onKeyDown={() => ({})}
                              tabIndex={0}
                              role="button"
                            >
                              <div
                                className={`mx-8 flex flex-col duration-300 transition-all ${
                                  hidden && showHiddenNfts
                                    ? 'opacity-30'
                                    : 'opacity-100'
                                }`}
                              >
                                <H4
                                  extraClasses={`line-clamp-1 ${
                                    isNameEthereumAddress
                                      ? 'break-all'
                                      : 'break-words'
                                  }`}
                                >
                                  {name ? name : blankValue}
                                </H4>
                                <span className="text-gray-syn4 text-sm pt-4">
                                  Floor price
                                </span>
                                <div className="space-x-2 pt-1 h-1/3 overflow-y-scroll no-scroll-bar">
                                  <span className="">
                                    {floorPrice
                                      ? `${floorPrice} ${
                                          isDemoMode
                                            ? 'ETH'
                                            : activeNetwork.nativeCurrency
                                                .symbol
                                        }`
                                      : blankValue}
                                  </span>
                                  {+floorPrice > 0 && (
                                    <span className="text-gray-syn4">
                                      (
                                      {floatedNumberWithCommas(
                                        +floorPrice * nativeTokenPrice
                                      )}{' '}
                                      USD)
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      } else {
                        return <></>;
                      }
                    }
                  )}
                </div>
              </InfiniteScroll>
            ) : null}
          </div>
        </div>
      </div>

      <CollectibleDetailsModal
        isOwner={isOwner}
        selectedCollectibleDetails={selectedCollectibleDetails}
        setDetailsOfSelectedCollectible={setDetailsOfSelectedCollectible}
        overlayCollectibleId={overlayCollectibleId}
        setOverlayCollectibleId={setOverlayCollectibleId}
        showCollectibleModal={showCollectibleModal}
        setShowCollectibleModal={setShowCollectibleModal}
        showFullScreen={showFullScreen}
        setShowFullScreen={setShowFullScreen}
      />
    </div>
  );
};
