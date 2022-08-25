import { NFTMediaType } from '@/components/collectives/nftPreviewer';
import {
  useCreateState,
  useUpdateState
} from '@/hooks/collectives/useCreateCollective';
import { resetCollectiveCreationState } from '@/state/createCollective/slice';
import { elementToImage } from '@/utils/elementToImage';
import router from 'next/router';
import { FC, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import TwoColumnLayout, { TwoColumnLayoutType } from '../twoColumnLayout';
import CreateCollectiveCustomize, { CustomizeRightPanel } from './customize';
import CreateCollectiveDesign, { DesignRightPanel } from './design';
import CreateCollectiveReview, { ReviewRightPanel } from './review';
import { CreateCollectiveSuccess, SuccessRightPanel } from './success';
import TransitionBetweenChildren, {
  TransitionBetweenChildrenType
} from '@/components/transitionBetweenChildren';

const CreateCollectiveContainer: FC = () => {
  const dispatch = useDispatch();
  const { creationStatus, artwork, artworkType } = useCreateState();
  const { handleCaptureGeneratedArtwork } = useUpdateState();

  const [activeIndex, setActiveIndex] = useState(0);
  const [showNavButton, setShowNavButton] = useState(true);
  const [, setShowBackButton] = useState(true);
  const [flipColumns, setFlipColumns] = useState(false);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);
  const captureArtworkRef = useRef(null);

  useEffect(() => {
    if (creationStatus.transactionSuccess) {
      handleNext();
    }
  }, [creationStatus.transactionSuccess]);

  const handleExitClick = (event) => {
    event.preventDefault();
    dispatch(resetCollectiveCreationState());
    router.push('/');
  };

  useEffect(() => {
    if (activeIndex === 3) {
      setShowNavButton(false);
      setShowBackButton(false);
      setNextBtnDisabled(false);
      setFlipColumns(true);
    } else {
      setShowNavButton(true);
      setShowBackButton(true);
      setFlipColumns(false);
    }
  }, [activeIndex]);

  // Placeholder for back and next on dot indicator
  const handlePrev = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  const handleNext = () => {
    // We are not subtracting 1 from dotIndicatorOptions.length because the last step is the success screen.
    if (activeIndex < dotIndicatorOptions.length) {
      setActiveIndex(activeIndex + 1);
    }
  };

  // This saves the artwork so that in the event user clicks the next button on
  // the navbar, the artwork will be already saved in store
  const handleNavNextButton = () => {
    // captureArtworkRef is only available on index 0
    if (artworkType === NFTMediaType.CUSTOM && activeIndex == 0) {
      elementToImage(captureArtworkRef, 2, (imageURI) => {
        handleCaptureGeneratedArtwork(imageURI, artwork.backgroundColorClass);
        handleNext();
      });
    } else {
      handleNext();
    }
  };

  const dotIndicatorOptions = ['Design', 'Customize', 'Review'];

  return (
    <>
      <TwoColumnLayout
        managerSettingsOpen={true}
        dotIndicatorOptions={activeIndex == 3 ? [] : dotIndicatorOptions}
        handleExitClick={handleExitClick}
        activeIndex={activeIndex}
        hideWalletAndEllipsis={false}
        showCloseButton={false}
        headerTitle="Create a Collective"
        type={TwoColumnLayoutType.FLEX}
        showSideNav={showNavButton}
        showNavButton={showNavButton}
        showDotIndicatorLabels={false}
        handlePrevious={handlePrev}
        handleNext={handleNavNextButton}
        nextBtnDisabled={nextBtnDisabled}
        flipColumns={flipColumns}
        leftColumnComponent={
          <div className="lg:ml-14">
            <TransitionBetweenChildren
              visibleChildIndex={activeIndex}
              transitionType={TransitionBetweenChildrenType.VERTICAL_MOVE}
              extraClasses="h-full"
            >
              <CreateCollectiveDesign
                handleNext={handleNext}
                setNextBtnDisabled={setNextBtnDisabled}
                captureArtworkRef={captureArtworkRef}
                activeIndex={activeIndex}
              />
              <CreateCollectiveCustomize
                handleNext={handleNext}
                setNextBtnDisabled={setNextBtnDisabled}
                activeIndex={activeIndex}
              />
              {activeIndex > 1 && ( // avoids a crash, prevents rendering before necessary
                <CreateCollectiveReview
                  handleNext={handleNext}
                  setNextBtnDisabled={setNextBtnDisabled}
                />
              )}
              {activeIndex > 2 && (
                <SuccessRightPanel
                  extraClasses={`${
                    activeIndex === 3
                      ? 'opacity-100 animate-move-in-brief'
                      : 'opacity-0'
                  } transition-all delay-1000 duration-800`}
                />
              )}
            </TransitionBetweenChildren>
          </div>
        }
        rightColumnComponent={
          <div className="w-full relative pt-4 h-full">
            {/* Shrinking square */}
            <div
              className={`absolute z-10 top-0 bg-opacity-50 w-full border perfect-square transition-all duration-800 transform left-1/2 -translate-x-1/2 ${
                activeIndex >= 1
                  ? 'overflow-hidden max-w-20 top-5/12 left-1/2 -translate-x-1/2 -translate-y-1/2 p-12 border-gray-syn6 border-8'
                  : 'max-w-520 top-0 left-0 translate-x-0 translate-y-0 border-transparent border-8'
              } ${activeIndex === 3 && 'hidden'}`}
            >
              {/* NFT previewer */}
              <div
                className={`absolute z-10 transform w-full transition-all duration-500 ${
                  activeIndex === 0
                    ? 'top-0 left-0 translate-x-0 translate-y-0 scale-100'
                    : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-50'
                }`}
              >
                <div
                  className={`transition-all w-full h-120 duration-500 relative ${
                    activeIndex === 0 ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <DesignRightPanel />
                </div>
              </div>

              {/* NFT image */}
              <div
                className={`absolute z-0 w-full h-full transition-all duration-500 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 delay-500 ${
                  activeIndex >= 1 ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <ReviewRightPanel />
              </div>
            </div>

            {/* Constellation */}
            <div
              className={`absolute z-0 w-full flex-grow h-full ${
                activeIndex > 0 ? 'opacity-100' : 'opacity-0'
              } ${
                activeIndex === 3 && 'hidden'
              } delay-700 duration-1000 transition-all relative z-0`}
            >
              <div
                className={`${
                  activeIndex > 0 ? 'scale-100' : 'scale-0'
                } transform transition-all duration-1000 delay-700 h-full`}
              >
                <CustomizeRightPanel />
              </div>
            </div>

            {/* Success */}
            {activeIndex === 3 && <CreateCollectiveSuccess />}
          </div>
        }
      />
    </>
  );
};

export default CreateCollectiveContainer;
