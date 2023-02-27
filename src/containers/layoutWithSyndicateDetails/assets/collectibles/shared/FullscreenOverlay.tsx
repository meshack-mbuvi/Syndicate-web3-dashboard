import React from 'react';

type FullScreenOverlayProps = {
  showFullScreen: boolean;
  videoNft: boolean;
};

const FullScreenOverlay: React.FC<FullScreenOverlayProps> = ({
  showFullScreen,
  videoNft,
  children
}) => {
  return (
    <>
      {showFullScreen ? (
        <div
          className={`fixed w-full h-full z-60 no-scroll-bar inset-0 bg-black flex items-center justify-center cursor-default ${
            videoNft ? '' : ''
          }`}
        >
          <div
            style={{
              height: !videoNft ? '609px' : 'auto',
              width: !videoNft ? '609px' : 'auto'
            }}
            className={'bg-black flex items-center justify-center'}
          >
            {children}
          </div>
        </div>
      ) : null}
    </>
  );
};

export default FullScreenOverlay;
