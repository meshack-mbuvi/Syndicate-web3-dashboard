import { useCreateState } from '@/hooks/collectives/useCreateCollective';
import { resetCollectiveCreationState } from '@/state/createCollective/slice';
import router from 'next/router';
import { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import TwoColumnLayout, { TwoColumnLayoutType } from '../twoColumnLayout';
import CreateCollectiveCustomize, { CustomizeRightPanel } from './customize';
import CreateCollectiveDesign, { DesignRightPanel } from './design';
import CreateCollectiveReview, { ReviewRightPanel } from './review';
import CreateCollectiveSuccess, { SuccessRightPanel } from './success';

const CreateCollectiveContainer: FC = () => {
  const dispatch = useDispatch();
  const { creationStatus } = useCreateState();

  const [activeIndex, setActiveIndex] = useState(0);
  const [showNavButton, setShowNavButton] = useState(true);
  const [showBackButton, setShowBackButton] = useState(true);

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
    } else {
      setShowNavButton(true);
      setShowBackButton(true);
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

  const dotIndicatorOptions = ['Design', 'Customize', 'Review'];

  return (
    <>
      <TwoColumnLayout
        managerSettingsOpen={true}
        dotIndicatorOptions={[]}
        handleExitClick={handleExitClick}
        activeIndex={activeIndex}
        setActiveIndex={handlePrev}
        hideWalletAndEllipsis={false}
        showCloseButton={showBackButton}
        headerTitle="Create a Collective"
        type={TwoColumnLayoutType.FLEX}
        showNavButton={showNavButton}
        leftColumnComponent={
          <>
            {activeIndex === 0 && (
              <div className="h-full flex-grow">
                <CreateCollectiveDesign handleNext={handleNext} />
              </div>
            )}
            {activeIndex === 1 && (
              <div className="h-full flex-grow">
                <CreateCollectiveCustomize handleNext={handleNext} />
              </div>
            )}
            {activeIndex === 2 && (
              <div className="h-full flex-grow">
                <CreateCollectiveReview handleNext={handleNext} />
              </div>
            )}
            {activeIndex === 3 && (
              <div className="w-full flex-grow flex">
                <div className="w-full flex-grow">
                  <CreateCollectiveSuccess />
                </div>
              </div>
            )}
          </>
        }
        rightColumnComponent={
          <div className="w-full flex-grow flex">
            {activeIndex === 0 && (
              <div className="mt-8 w-full flex-grow">
                <DesignRightPanel />
              </div>
            )}
            {activeIndex === 1 && (
              <div className="mt-8 w-full flex-grow">
                <CustomizeRightPanel />
              </div>
            )}
            {activeIndex === 2 && (
              <div className="mt-8 w-full flex-grow hidden md:block">
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
