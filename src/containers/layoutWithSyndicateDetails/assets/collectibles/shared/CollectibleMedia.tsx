import {
  Collectible,
  CollectibleDetails
} from '@/containers/layoutWithSyndicateDetails/assets/collectibles';
import FutureCollectiblePill from '@/containers/layoutWithSyndicateDetails/assets/collectibles/shared/FutureCollectiblePill';
import HideAssetPill from '@/containers/layoutWithSyndicateDetails/assets/shared/HideAssetPill';
import { FC, useEffect, useRef, useState } from 'react';
import Tooltip from 'react-tooltip-lite';

interface ICollectibleMedia {
  showCollectibles: boolean;
  showHiddenNfts?: boolean;
  showOrHideNfts?: (e: Event, contractAddress: string) => void;
  mediaType: string;
  setDetailsOfSelectedCollectible: (details: CollectibleDetails) => void;
  isOwner?: boolean;
  collectible: Collectible;

  overlayCollectibleId: string;
  setOverlayCollectibleId: (overlayCollectibleId: string) => void;
  showCollectibleModal: boolean;
  showFullScreen: boolean;
  setShowFullScreen: (showFullScreen: boolean) => void;
}

const CollectibleMedia: FC<ICollectibleMedia> = ({
  collectible,
  mediaType,
  showCollectibles,
  setDetailsOfSelectedCollectible,
  showHiddenNfts,
  showOrHideNfts,
  isOwner,

  overlayCollectibleId,
  setOverlayCollectibleId,
  showCollectibleModal,
  showFullScreen,
  setShowFullScreen
}) => {
  const {
    assetId,
    image,
    animation,
    permalink,
    collection,
    floorPrice,
    lastPurchasePrice
  } = collectible || {};

  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [muteAudio, setMuteAudio] = useState(true);
  const [muteVideo, setMuteVideo] = useState(true);

  const videoMute = (): void => {
    if (videoRef.current) {
      videoRef.current.muted = !muteVideo;
      setMuteVideo(!muteVideo);
    }
  };

  const audioMute = (): void => {
    if (audioRef.current) {
      void audioRef.current.play();
      audioRef.current.volume = 0.3;
      audioRef.current.muted = !muteAudio;
      setMuteAudio(!muteAudio);
    }
  };

  const muteBackgroundMedia = (): void => {
    // mute media that is already playing when the same media is opened
    // inside the modal or full-screen overlay.
    if (mediaType === 'videoNFT' && videoRef.current) {
      videoRef.current.muted = true;
      setMuteVideo(true);
    } else if (mediaType === 'soundtrackNFT' && audioRef.current) {
      audioRef.current.muted = true;
      setMuteAudio(true);
    }
  };

  const handleMobileFullScreenExit = (): void => {
    setShowFullScreen(false);
  };

  useEffect(() => {
    if (videoRef && videoRef.current) {
      const video = videoRef.current;
      video.addEventListener('webkitendfullscreen', handleMobileFullScreenExit);
      return () => {
        video.removeEventListener(
          'webkitendfullscreen',
          handleMobileFullScreenExit
        );
      };
    }
    return;
  }, []);

  const setActiveCollectibleDetails = (details: CollectibleDetails): void => {
    setDetailsOfSelectedCollectible?.(details);
    muteBackgroundMedia();
  };

  // link to OpenSea
  let OpenSeaLink;
  if (permalink) {
    OpenSeaLink = (
      <div className="cursor-pointer z-20">
        <a
          href={permalink}
          target="_blank"
          rel="noreferrer"
          className="outline-none"
        >
          <Tooltip
            content={<div>View collection on Opensea</div>}
            arrow={false}
            tipContentClassName="actionsTooltip"
            background="#131416"
            padding="16px"
            distance={10}
          >
            <img
              src="/images/actionIcons/openSeaIcon.svg"
              className="h-8 w-8"
              alt="Opensea icon"
            />
          </Tooltip>
        </a>
      </div>
    );
  }

  // NFT media
  let media;
  const mediaClickButton = showCollectibles ? (
    <button
      className={`w-full h-full ${
        collectible?.hidden ? 'cursor-not-allowed' : 'cursor-pointer'
      }`}
      onClick={(): void => {
        // do not open details modal if nft is hidden
        if (!collectible || collectible.hidden || !mediaType) return;
        setActiveCollectibleDetails({
          collectible,
          mediaType,
          moreDetails: {
            'Token ID': collectible?.futureNft ? '' : assetId ?? '',
            'Token collection': collection?.name ?? '',
            'Floor price': floorPrice ?? '0',
            'Last purchase price':
              lastPurchasePrice?.lastPurchasePriceETH.toString() ?? 0
          }
        });
      }}
    ></button>
  ) : null;
  if (mediaType === 'imageOnlyNFT') {
    media = (
      <div
        style={{
          backgroundImage:
            image &&
            `url('${
              image.includes('ipfs://')
                ? `https://syndicate.mypinata.cloud/ipfs/${image.replace(
                    'ipfs://',
                    ''
                  )}`
                : image
            }')`,
          backgroundSize: `${showFullScreen ? 'contain' : 'cover'}`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center'
        }}
        className={` bg-black ${
          showFullScreen ? 'h-full' : 'perfect-square-box'
        } w-full relative`}
      >
        {mediaClickButton}
      </div>
    );
  } else if (mediaType === 'animatedNFT') {
    media = (
      <div className={`${showFullScreen ? 'w-full' : ''} relative h-full`}>
        <img
          src={animation}
          alt="animated nft"
          className={`${showFullScreen ? 'w-full' : ''} h-full`}
        />
        <div className="absolute inset-0">{mediaClickButton}</div>
      </div>
    );
  } else if (mediaType === 'videoNFT' || mediaType === 'htmlNFT') {
    media = (
      <div
        className={`relative ${
          showFullScreen
            ? 'flex justify-center items-center'
            : 'perfect-square-box'
        }`}
      >
        <div className="absolute inset-0 z-8">{mediaClickButton}</div>
        <video
          autoPlay
          playsInline={
            showFullScreen && collectible.id === overlayCollectibleId
              ? false
              : true
          }
          loop
          muted
          className={`${showFullScreen ? 'object-cover' : ''} z-10`}
          ref={videoRef}
        >
          {/* Specifying type as "video/mp4" works for both .mov and .mp4 files  */}
          <source
            src={
              mediaType === 'htmlNFT'
                ? 'https://litwtf.mypinata.cloud/ipfs/QmVjgAD5gaNQ1cLpgKLeuXDPX8R1yeajtWUhM6nV7VAe6e/4.mp4'
                : animation
            }
            type="video/mp4"
          ></source>
        </video>
      </div>
    );
  } else if (mediaType === 'soundtrackNFT') {
    const mp3Animation = animation?.match(/\.mp3$/) != null;
    media = (
      <div
        style={{
          backgroundImage: `url('${image ?? ''}')`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center'
        }}
        className={`flex flex-col w-full justify-end items-center ${
          showFullScreen ? 'h-full' : 'perfect-square-box'
        } relative border-0`}
      >
        <div className="w-full h-full flex justify-center">
          <audio
            loop
            autoPlay
            muted
            className="w-4/5 mb-4"
            controlsList="nodownload"
            ref={audioRef}
          >
            <source
              src={animation}
              type={mp3Animation ? `audio/mpeg` : `audio/wav`}
            />
          </audio>
          {mediaClickButton}
        </div>
      </div>
    );
  }

  if (media) {
    return (
      <div
        className={`col-span-5 md:col-span-4 xl:col-span-3 ${
          showCollectibleModal ? 'w-full' : ''
        } ${showFullScreen ? 'h-full' : ''}`}
      >
        <div
          className={`${
            showCollectibles
              ? 'border-r-1 border-l-1 border-t-1 border-gray-syn6 rounded-t-2.5xl perfect-square-box'
              : ''
          }  ${
            showFullScreen ? 'h-full' : 'relative bg-gray-syn7 overflow-hidden'
          }`}
        >
          <div
            className={`duration-300 transition-all h-full w-full ${
              collectible && collectible.hidden && showHiddenNfts
                ? 'opacity-30'
                : 'opacity-100'
            }`}
          >
            {media}
          </div>

          {showFullScreen ? (
            <div className="absolute right-14 bottom-14 flex items-center z-10">
              {permalink && (
                <a
                  href={permalink}
                  className="mr-4"
                  rel="noreferrer"
                  target="_blank"
                >
                  <div className="bg-white rounded-full w-8 h-8 flex items-center justify-center">
                    <img
                      src="/images/actionIcons/openSeaIconDark.svg"
                      className="w-4 h-4"
                      alt="View on OpenSea"
                    />
                  </div>
                </a>
              )}

              {/* mute/unmute icon  */}
              {mediaType === 'videoNFT' ||
              mediaType === 'soundtrackNFT' ||
              mediaType === 'htmlNFT' ? (
                <div className="mr-4 z-10">
                  <button
                    onClick={(): void => {
                      if (mediaType === 'videoNFT' || mediaType === 'htmlNFT') {
                        videoMute();
                      } else {
                        audioMute();
                      }
                    }}
                  >
                    {mediaType === 'videoNFT' || mediaType === 'htmlNFT' ? (
                      <div className="bg-white rounded-full w-8 h-8 flex items-center justify-center">
                        {muteVideo ? (
                          <img
                            className="h-4 w-4"
                            src="/images/actionIcons/muteIcon.svg"
                            alt=""
                          />
                        ) : (
                          <img
                            className="h-4 w-4"
                            src="/images/actionIcons/unmuteIcon.svg"
                            alt=""
                          />
                        )}
                      </div>
                    ) : null}
                    {mediaType === 'soundtrackNFT' ? (
                      <div className="bg-white rounded-full w-8 h-8 flex items-center justify-center">
                        {muteAudio ? (
                          <img
                            className="h-4 w-4"
                            src="/images/actionIcons/muteIcon.svg"
                            alt=""
                          />
                        ) : (
                          <img
                            className="h-4 w-4"
                            src="/images/actionIcons/unmuteIcon.svg"
                            alt=""
                          />
                        )}
                      </div>
                    ) : null}
                  </button>
                </div>
              ) : null}

              {/* close full screen button  */}
              <button
                className="mr-4 z-10"
                onClick={(): void => {
                  setShowFullScreen(false);
                }}
              >
                <div className="bg-white rounded-full w-8 h-8 flex items-center justify-center">
                  <img
                    src="/images/actionIcons/exitFullScreen.svg"
                    className="w-4 h-4"
                    alt="exit full screen"
                  />
                </div>
              </button>
            </div>
          ) : (
            <>
              {
                <div
                  id="controls"
                  className={`absolute bottom-4 z-10 ${
                    showCollectibles ? 'right-4' : 'right-14'
                  } flex items-center space-x-4 select-none`}
                >
                  {/* hide/unhide nft button  */}
                  {isOwner && collectible ? (
                    <div className="duration-300 transition-all opacity-0 group-hover:opacity-100">
                      <HideAssetPill
                        hide={!collectible.hidden}
                        iconOnly={true}
                        onClick={(e): void | null =>
                          showOrHideNfts
                            ? showOrHideNfts(e, collectible.id)
                            : null
                        }
                      />
                    </div>
                  ) : null}

                  {mediaType === 'videoNFT' ||
                  mediaType === 'soundtrackNFT' ||
                  mediaType === 'htmlNFT' ? (
                    <button
                      className={`${
                        !showCollectibleModal
                          ? 'bg-white bg-opacity-30 rounded-full w-8 h-8'
                          : ''
                      }`}
                      onClick={() => {
                        if (
                          mediaType === 'videoNFT' ||
                          mediaType === 'htmlNFT'
                        ) {
                          videoMute();
                        } else {
                          audioMute();
                        }
                      }}
                    >
                      {mediaType === 'videoNFT' || mediaType === 'htmlNFT' ? (
                        <>
                          {muteVideo ? (
                            <img
                              className="h-8 w-8"
                              src="/images/nftClaim/mute-overlay.svg"
                              alt=""
                            />
                          ) : (
                            <img
                              className="h-8 w-8"
                              src="/images/nftClaim/unmute-overlay.svg"
                              alt=""
                            />
                          )}
                        </>
                      ) : null}
                      {mediaType === 'soundtrackNFT' ? (
                        <>
                          {muteAudio ? (
                            <img
                              className="h-8 w-8"
                              src="/images/nftClaim/mute-overlay.svg"
                              alt=""
                            />
                          ) : (
                            <img
                              className="h-8 w-8"
                              src="/images/nftClaim/unmute-overlay.svg"
                              alt=""
                            />
                          )}
                        </>
                      ) : null}
                    </button>
                  ) : null}
                </div>
              }
              {!showCollectibles ? (
                <>
                  <div className="absolute bottom-4 left-4 flex items-center space-x-4 select-none">
                    {OpenSeaLink}
                  </div>
                  <div className="absolute bottom-4 right-4 flex items-center space-x-4 select-none z-10 cursor-pointer">
                    <button
                      className=""
                      onClick={(): void => {
                        muteBackgroundMedia();
                        setOverlayCollectibleId(collectible.id);
                        setShowFullScreen(true);
                      }}
                    >
                      <img
                        src="/images/actionIcons/fullScreenIcon.svg"
                        className="w-8 h-8"
                        alt="open full screen"
                      />
                    </button>
                  </div>
                </>
              ) : null}

              {/* Future collectible pill  */}
              {showCollectibles && (
                <button
                  className={`absolute top-4 left-4 ${
                    collectible?.hidden
                      ? 'cursor-not-allowed'
                      : 'cursor-pointer'
                  }`}
                  onClick={(): void => {
                    if (collectible?.hidden || !collectible || !mediaType)
                      return;
                    setActiveCollectibleDetails({
                      collectible,
                      mediaType,
                      moreDetails: {
                        'Token ID': collectible?.futureNft ? '' : assetId ?? '',
                        'Token collection': collection?.name ?? '',
                        'Floor price': floorPrice ?? '0',
                        'Last purchase price': (
                          lastPurchasePrice?.lastPurchasePriceETH ?? 0
                        ).toString()
                      }
                    });
                  }}
                >
                  {collectible?.hidden && showHiddenNfts ? (
                    <HideAssetPill
                      currentlyHidden={true}
                      backgroundColor="bg-white bg-opacity-10"
                    />
                  ) : collectible?.futureNft && !collectible?.hidden ? (
                    <FutureCollectiblePill />
                  ) : null}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    );
  }
  // If we don't return a React node, the app crashes with
  // Error: Minified React error #152; visit https://reactjs.org/docs/error-decoder.html?invariant=152&args[]=L
  return <></>;
};

export default CollectibleMedia;
