import NumberTreatment from '@/components/NumberTreatment';
import { Spinner } from '@/components/shared/spinner';
import useAvailableToClaim from '@/hooks/useRugUtility';
import Image from 'next/image';
import { FC, useRef } from 'react';
import RugRadioTokenIcon from '/public/images/rugRadio/tokenIcon.svg';

interface INFTComponentProps {
  showCollectibles: boolean;
  mediaType: string;
  refresh?: boolean;
  setDetailsOfSelectedCollectible?: (details: any) => void;
  collectible: {
    assetId: string;
    id: string;
    image: string;
    animation: string;
    permalink: string;
    name: string;
    description: string;
    collection: any;
    floorPrice: string;
  };
}

const NFTComponent: FC<INFTComponentProps> = ({
  collectible,
  mediaType,
  showCollectibles,
  refresh
}) => {
  const { image, animation } = collectible;

  const { tokenBalance, tokenProduction, loading } = useAvailableToClaim(
    collectible?.assetId,
    refresh
  );

  const videoRef = useRef(null);
  const audioRef = useRef(null);

  // NFT media
  let media;

  if (mediaType === 'imageOnlyNFT') {
    media = (
      <div
        style={{
          backgroundImage: `url('${image}')`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center 20%'
        }}
        className={`perfect-square-box w-full relative`}
      ></div>
    );
  } else if (mediaType === 'animatedNFT') {
    media = (
      <div className={`relative h-full`}>
        <img src={animation} alt="animated nft" className={`h-full`} />
      </div>
    );
  } else if (mediaType === 'videoNFT' || mediaType === 'htmlNFT') {
    media = (
      <div
        className={`relative "perfect-square-box"
        `}
      >
        <video
          autoPlay
          loop
          muted
          className={`object-cover z-10`}
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
        className={`flex flex-col w-full justify-end items-center perfect-square-box relative border-0`}
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
        </div>
      </div>
    );
  }

  if (media) {
    return (
      <div
        className={`col-span-12 md:col-span-6 lg:col-span-6 2xl:w-88 w-full max-w-480 h-full`}
      >
        <div
          className={`flex flex-col ${
            showCollectibles ? 'border-t-1 border-gray-syn6 rounded-2.5xl' : ''
          }  bg-gray-syn7 overflow-hidden relative`}
        >
          <div className="w-full lg:h-88 lg:w-88 max-w-480 border-r-1 border-l-1 border-t-1 border-gray-syn6 rounded-t-2.5xl">
            {media}
          </div>

          <div className="flex rounded-b-2.5xl py-6 border-1 border-gray-syn6">
            <div className="mx-8 flex flex-col space-y-4">
              <div className="space-y-1">
                <span className={`line-clamp-1 text-xl `}>
                  {collectible.name}
                </span>
                <p className="flex text-gray-syn4 text-base font-whyte">
                  <span className="mr-2 flex">
                    <Image
                      src={RugRadioTokenIcon}
                      width={16}
                      height={16}
                      alt="token icon"
                    />{' '}
                  </span>
                  Generating {tokenProduction} RUG per day
                </p>
              </div>
              <div className="flex flex-col space-y-1">
                <span className="text-sm text-gray-syn4">
                  Available to claim
                </span>
                <p className="text-gray-syn4 text-base">
                  {loading ? (
                    <Spinner />
                  ) : (
                    <>
                      <NumberTreatment numberValue={tokenBalance} /> RUG
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If we don't return a React node, the app crashes with
  // Error: Minified React error #152; visit https://reactjs.org/docs/error-decoder.html?invariant=152&args[]=L
  return <></>;
};

export default NFTComponent;
