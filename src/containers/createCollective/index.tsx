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
import CreateCollectiveSuccess, { SuccessRightPanel } from './success';

const CreateCollectiveContainer: FC = () => {
  const dispatch = useDispatch();
  const { creationStatus, artwork, artworkType } = useCreateState();
  const { handleCaptureGeneratedArtwork } = useUpdateState();

  const [activeIndex, setActiveIndex] = useState(0);
  const [showNavButton, setShowNavButton] = useState(true);
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
      setNextBtnDisabled(false);
    } else {
      setShowNavButton(true);
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
        leftColumnComponent={
          <div className="flex justify-center lg:ml-14">
            {activeIndex === 0 && (
              <div className="h-full flex-grow xl:ml-auto">
                <CreateCollectiveDesign
                  handleNext={handleNext}
                  setNextBtnDisabled={setNextBtnDisabled}
                  captureArtworkRef={captureArtworkRef}
                />
              </div>
            )}
            {activeIndex === 1 && (
              <div className="h-full flex-grow xl:ml-auto">
                <CreateCollectiveCustomize
                  handleNext={handleNext}
                  setNextBtnDisabled={setNextBtnDisabled}
                />
              </div>
            )}
            {activeIndex === 2 && (
              <div className="flex h-full md:max-w-md flex-grow xl:ml-auto">
                <CreateCollectiveReview
                  handleNext={handleNext}
                  setNextBtnDisabled={setNextBtnDisabled}
                />
              </div>
            )}
            {activeIndex === 3 && (
              <div className="w-full flex-grow flex xl:ml-auto">
                <div className="w-full flex-grow">
                  <CreateCollectiveSuccess />
                </div>
              </div>
            )}
          </div>
        }
        rightColumnComponent={
          <div className="justify-center md:mt-14 h-full flex-grow flex">
            {activeIndex === 0 && (
              <div className="justify-center md:justify-start w-full flex-grow hidden md:flex">
                <DesignRightPanel customId={'design-right-panel'} />
              </div>
            )}
            {activeIndex === 1 && (
              <div className="w-full flex-grow hidden md:block">
                <CustomizeRightPanel />
              </div>
            )}
            {activeIndex === 2 && (
              <div className="w-full flex-grow hidden md:block">
                <ReviewRightPanel />
              </div>
            )}

            {activeIndex === 3 && (
              <div className="w-full flex-grow">
                <SuccessRightPanel />
              </div>
            )}
          </div>
        }
      />
    </>
  );
};

export default CreateCollectiveContainer;
