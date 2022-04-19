import { AppState } from '@/state';
import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';

const NFTCard: React.FC = () => {
  const {
    erc721TokenSliceReducer: { erc721Token }
  } = useSelector((state: AppState) => state);

  const [nftType, setNftType] = useState('');
  const [source, setSource] = useState('');
  // const [mute, setMute] = useState(true);

  const collectible = {
    image:
      'https://daiakrtkievq7ofrm5xaoecjyjfmsybdd2nxxdm5ey74a4ku6ama.arweave.net/GBAFRmpBKw-4sWduBxBJwkrJYCMem3uNnSY_wHFU8Bg',
    name: '',
    animation: '',
    permalink: ''
  };

  // const collectible = {
  //   image: "",
  //   name: "",
  //   animation:
  //     "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  //   permalink: "",
  // };

  useEffect(() => {
    const { image, animation } = collectible;

    if (image && !animation) {
      setNftType('image');
      setSource(image);
    } else if (animation) {
      // animation could be a .mov or .mp4 video
      if (
        animation.match(/\.mov$/) != null ||
        animation.match(/\.mp4$/) != null
      ) {
        setNftType('video');
        setSource(animation);
      } else if (animation.match(/\.gif$/) != null) {
        setNftType('animatedGif');
        setSource(animation);
      }
    }
  }, [collectible]);

  const videoRef = useRef(null);

  // const videoMute = () => {
  //   videoRef.current.muted = !mute;
  //   setMute(!mute);
  // };

  return (
    <div className="md:max-w-480 sm:w-full md:w-5.21/12 h-100 bg-gray-syn4 rounded-1.5lg">
      {nftType === 'image' ? (
        <div
          style={{
            backgroundColor: '#232529',
            backgroundImage: `url('${erc721Token.defaultImage}')`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center center'
          }}
          className="h-full w-full rounded-1.5lg"
        ></div>
      ) : nftType === 'animatedGif' ? (
        <div className="bg-gray-syn7 border-r-1 border-l-1 border-t-1 border-gray-syn6 h-80 rounded-1.5lg overflow-hidden">
          <img src={source} alt="animated nft" />
        </div>
      ) : nftType === 'video' ? (
        <div className="h-full w-full bg-gray-syn7 overflow-hidden rounded-1.5lg relative">
          <video
            autoPlay
            loop
            muted
            className="rounded-1.5lg h-full w-full object-cover video-320"
            ref={videoRef}
          >
            {/* Specifying type as "video/mp4" works for both .mov and .mp4 files  */}
            <source src={source} type="video/mp4"></source>
          </video>

          {/* Custom Video controls */}

          {/* <div
            id="controls"
            className="absolute bottom-4 right-4 flex items-center space-x-4 select-none"
          >
            <div className="cursor-pointer" onClick={() => videoMute()}>
              {mute ? (
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
            </div>
            <div className="cursor-pointer">
              <img
                className="h-8 w-8"
                src="/images/nftClaim/fullScreen-overlay.svg"
                alt="checkmark"
              />
            </div>
          </div> */}
        </div>
      ) : null}
    </div>
  );
};

export default NFTCard;
