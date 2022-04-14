import FutureCollectiblePill from '@/containers/layoutWithSyndicateDetails/assets/collectibles/shared/FutureCollectiblePill';
import { AppState } from '@/state';
import {
  setOverlayCollectibleDetails,
  setShowFullScreen
} from '@/state/assets/collectibles/slice';
import { FC, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Tooltip from 'react-tooltip-lite';

interface ICollectibleMedia {
  showCollectibles: boolean;
  mediaType: string;
  setDetailsOfSelectedCollectible?: (details: any) => void;
  collectible: {
    id: string;
    image: string;
    animation: string;
    permalink: string;
    name: string;
    description: string;
    collection: any;
    floorPrice: string;
    lastPurchasePrice: string;
    futureNft?: boolean;
  };
}

const CollectibleMedia: FC<ICollectibleMedia> = ({
  collectible,
  mediaType,
  showCollectibles,
  setDetailsOfSelectedCollectible
}) => {
  const {
    setCollectibleDetailsSliceReducer: {
      showFullScreen,
      showCollectibleModal,
      overlayCollectibleDetails
    }
  } = useSelector((state: AppState) => state);

  const dispatch = useDispatch();
  const {
    id,
    image,
    animation,
    permalink,
    collection,
    floorPrice,
    lastPurchasePrice
  } = collectible;

  const videoRef = useRef(null);
  const audioRef = useRef(null);

  const [muteAudio, setMuteAudio] = useState(true);
  const [muteVideo, setMuteVideo] = useState(true);

  const videoMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !muteVideo;
      setMuteVideo(!muteVideo);
    }
  };

  const audioMute = () => {
    if (audioRef.current) {
      audioRef.current.play();
      audioRef.current.volume = 0.3;
      audioRef.current.muted = !muteAudio;
      setMuteAudio(!muteAudio);
    }
  };

  const muteBackgroundMedia = () => {
    // mute media that is already playing when the same media is opened
    // inside the modal or full-screen overlay.
    if (mediaType === 'videoNFT') {
      videoRef.current.muted = true;
      setMuteVideo(true);
    } else if (mediaType === 'soundtrackNFT') {
      audioRef.current.muted = true;
      setMuteAudio(true);
    }
  };

  const handleMobileFullScreenExit = () => {
    dispatch(setShowFullScreen(false));
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
  }, []);

  const setActiveCollectibleDetails = (details: {
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
      'Token ID': string | React.ReactElement;
      'Token collection': any;
      'Floor price': any;
      'Last purchase price': any;
    };
  }) => {
    setDetailsOfSelectedCollectible(details);
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
      className="w-full h-full"
      onClick={() => {
        setActiveCollectibleDetails({
          collectible,
          mediaType,
          moreDetails: {
            'Token ID': collectible?.futureNft ? '' : id,
            'Token collection': collection.name,
            'Floor price': floorPrice,
            'Last purchase price': lastPurchasePrice
          }
        });
      }}
    ></button>
  ) : null;
  if (mediaType === 'imageOnlyNFT') {
    media = (
      <div
        style={{
          backgroundImage: `url('${image}')`,
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
            showFullScreen &&
            collectible.id === overlayCollectibleDetails?.collectible?.id
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
    const mp3Animation = animation.match(/\.mp3$/) != null;
    media = (
      <div
        style={{
          backgroundImage: `url('${image}')`,
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
          {media}

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
                    onClick={() => {
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
                onClick={() => {
                  dispatch(setShowFullScreen(false));
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
              {mediaType === 'videoNFT' ||
              mediaType === 'soundtrackNFT' ||
              mediaType === 'htmlNFT' ? (
                <div
                  id="controls"
                  className={`absolute bottom-4 z-10 ${
                    showCollectibles ? 'right-4' : 'right-14'
                  } flex items-center space-x-4 select-none`}
                >
                  <button
                    onClick={() => {
                      if (mediaType === 'videoNFT' || mediaType === 'htmlNFT') {
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
                </div>
              ) : null}
              {!showCollectibles ? (
                <>
                  <div className="absolute bottom-4 left-4 flex items-center space-x-4 select-none">
                    {OpenSeaLink}
                  </div>
                  <div className="absolute bottom-4 right-4 flex items-center space-x-4 select-none z-10 cursor-pointer">
                    <button
                      className=""
                      onClick={() => {
                        muteBackgroundMedia();
                        dispatch(
                          setOverlayCollectibleDetails({
                            collectible,
                            mediaType
                          })
                        );
                        dispatch(setShowFullScreen(true));
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
              {showCollectibles && collectible.futureNft && (
                <button
                  className="absolute top-4 left-4"
                  onClick={() => {
                    setActiveCollectibleDetails({
                      collectible,
                      mediaType,
                      moreDetails: {
                        'Token ID': collectible?.futureNft ? '' : id,
                        'Token collection': collection.name,
                        'Floor price': floorPrice,
                        'Last purchase price': lastPurchasePrice
                      }
                    });
                  }}
                >
                  <FutureCollectiblePill />
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
