import { SkeletonLoader } from '@/components/skeletonLoader';
import { B2, B3, H4 } from '@/components/typography';
import { useState } from 'react';

export enum NFTMediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO'
}

interface Props {
  name?: string;
  symbol?: string;
  description?: string;
  loading?: { name?: boolean; description?: boolean };
  mediaType?: NFTMediaType;
  mediaSource?: string;
  customClasses?: string;
}

export const NFTPreviewer: React.FC<Props> = ({
  name,
  symbol,
  description,
  loading,
  mediaType,
  mediaSource,
  customClasses
}) => {
  const descriptionText = (
    <>
      {/* Desktop */}
      <div className="hidden sm:block">
        <B2 extraClasses="text-gray-syn4">{description}</B2>
      </div>
      {/* Mobile */}
      <div className="sm:hidden">
        <B3 extraClasses="text-gray-syn4">{description}</B3>
      </div>
    </>
  );

  const [fullscreen, setFullscreen] = useState(false);
  const [muted, setaMuted] = useState(true);

  return (
    <div
      className={`max-w-120 border border-gray-syn6 rounded-2.5xl overflow-hidden ${customClasses}`}
    >
      {/* Media */}
      <div className={'perfect-square bg-gray-syn8 relative'}>
        {mediaType === NFTMediaType.VIDEO && (
          // eslint-disable-next-line jsx-a11y/media-has-caption
          <video
            autoPlay
            playsInline={true}
            loop
            muted={muted}
            className={`${'object-cover'} absolute h-full w-full`}
          >
            <source src={mediaSource} type="video/mp4"></source>
          </video>
        )}
        {mediaType === NFTMediaType.IMAGE && (
          <div
            className="w-full h-full absolute"
            style={{
              backgroundImage: `url('${mediaSource}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          ></div>
        )}
        <div className="absolute right-4 bottom-4 flex space-x-3 items-center">
          <button
            className="bg-white bg-opacity-20 rounded-full w-8 h-8"
            onClick={() => {
              setaMuted(!muted);
            }}
          >
            <img
              src={`${
                muted
                  ? '/images/nftClaim/mute-overlay.svg'
                  : '/images/nftClaim/unmute-overlay.svg'
              }`}
              alt="Enter fullscreen"
              className="mx-auto"
            />
          </button>
          <button
            className="bg-white bg-opacity-20 rounded-full w-8 h-8"
            onClick={() => {
              setFullscreen(true);
            }}
          >
            <img
              src="/images/actionIcons/fullScreenIcon.svg"
              alt="Enter fullscreen"
              className="mx-auto"
            />
          </button>
        </div>

        {fullscreen && (
          <div className="bg-black w-screen h-screen fixed top-0 left-0 z-30">
            {/* Media container */}
            <div
              className="transform relative w-full h-full"
              style={{
                maxWidth: '600px',
                maxHeight: '600px',
                transform: 'translate(-50%, -50%)',
                top: '50%',
                left: '50%'
              }}
            >
              {mediaType === NFTMediaType.IMAGE && (
                <div
                  className="w-full h-full absolute"
                  style={{
                    backgroundImage: `url('${mediaSource}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                ></div>
              )}
              {mediaType === NFTMediaType.VIDEO && (
                // eslint-disable-next-line jsx-a11y/media-has-caption
                <video
                  autoPlay
                  playsInline={true}
                  loop
                  muted={muted}
                  className={`${'object-cover'} z-10 absolute vertically-center`}
                >
                  <source src={mediaSource} type="video/mp4"></source>
                </video>
              )}
            </div>
            <div className="absolute right-14 bottom-14 flex space-x-3 items-center">
              <button
                className="bg-white rounded-full w-8 h-8"
                onClick={() => {
                  setaMuted(!muted);
                }}
              >
                <img
                  src={`${
                    muted
                      ? '/images/actionIcons/unmuteIcon.svg'
                      : '/images/actionIcons/muteIcon.svg'
                  }`}
                  alt="Enter fullscreen"
                  className="mx-auto"
                />
              </button>
              <button
                className="bg-white rounded-full w-8 h-8"
                onClick={() => {
                  setFullscreen(false);
                }}
              >
                <img
                  src="/images/actionIcons/exitFullScreen.svg"
                  alt="Enter fullscreen"
                  className="mx-auto"
                />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Name and description */}
      <div className="px-10 pb-10 pt-8 space-y-3.5">
        <div>
          <div
            className={`${
              loading.name === true
                ? 'opacity-100 max-h-32 duration-500'
                : 'opacity-0 max-h-0'
            } overflow-hidden transition-all`}
          >
            <SkeletonLoader height="6" width="1/2" borderRadius="rounded-md" />
          </div>
          <div
            className={`${
              loading.name !== true
                ? 'opacity-100 max-h-32 duration-500 '
                : 'opacity-0 max-h-0'
            } overflow-hidden transition-all`}
          >
            <H4>
              {name} <span className="text-gray-syn4">{symbol}</span>
            </H4>
          </div>
        </div>
        <div>
          <div
            className={`${
              loading.description === true
                ? 'opacity-100 max-h-32 duration-500 '
                : 'opacity-0 max-h-0'
            } overflow-hidden transition-all`}
          >
            <SkeletonLoader height="6" width="full" borderRadius="rounded-md" />
          </div>
          <div
            className={`${
              loading.description !== true
                ? 'opacity-100 max-h-screen duration-500'
                : 'opacity-0 max-h-0'
            } overflow-hidden transition-all`}
          >
            {descriptionText}
          </div>
        </div>
      </div>
    </div>
  );
};
