import React from 'react';
import { useSelector } from 'react-redux';
import { AppState } from '@/state';

import CollectibleMedia from './CollectibleMedia';

const FullScreenOverlay: React.FC = () => {
  const {
    setCollectibleDetailsSliceReducer: {
      showFullScreen,
      overlayCollectibleDetails
    }
  } = useSelector((state: AppState) => state);

  const { collectible, mediaType } = overlayCollectibleDetails;
  const videoNft = mediaType === 'videoNFT' || mediaType === 'htmlNFT';

  return (
    <>
      {showFullScreen && (
        <div
          className={`fixed w-screen h-screen z-60 no-scroll-bar inset-0 overflow-hidden bg-black flex items-center justify-center cursor-default ${
            videoNft ? '' : 'p-14'
          }`}
        >
          <div
            style={{
              height: !videoNft ? '609px' : 'auto',
              width: !videoNft ? '609px' : 'auto'
            }}
            className="flex items-center justify-center"
          >
            <CollectibleMedia
              {...{
                collectible,
                mediaType,
                showCollectibles: false
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default FullScreenOverlay;
