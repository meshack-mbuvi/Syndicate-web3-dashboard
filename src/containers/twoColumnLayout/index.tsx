import ErrorBoundary from '@/components/errorBoundary';
import Layout from '@/components/layout';
import { FinalStateModal } from '@/components/shared/transactionStates';
import Head from '@/components/syndicates/shared/HeaderTitle';
import { FC } from 'react';

export enum TwoColumnLayoutType {
  DEFAULT = 'DEFAULT',
  FLEX = 'FLEX'
}

const TwoColumnLayout: FC<{
  dotIndicatorOptions: string[];
  managerSettingsOpen: boolean;
  leftColumnComponent;
  rightColumnComponent;
  handleExitClick?;
  hideWalletAndEllipsis?: boolean;
  showCloseButton?: boolean;
  headerTitle: string;
  activeIndex?: number;
  type?: TwoColumnLayoutType;
  showNavButton?: boolean;
  flipColumns?: boolean;
  showSideNav?: boolean;
  showDotIndicatorLabels?: boolean;
  handlePrevious?: (event?) => void;
  handleNext?: (event?) => void;
  nextBtnDisabled?: boolean;
}> = ({
  managerSettingsOpen,
  leftColumnComponent,
  rightColumnComponent,
  headerTitle,
  activeIndex,
  showNavButton,
  handlePrevious = () => ({}),
  handleNext,
  handleExitClick = () => ({}),
  dotIndicatorOptions = [],
  hideWalletAndEllipsis = false,
  showCloseButton = false,
  type = TwoColumnLayoutType.DEFAULT,
  flipColumns = FinalStateModal,
  showSideNav = false,
  showDotIndicatorLabels = true,
  nextBtnDisabled = true
}) => {
  const baseColumnStyles = `flex-1 md:h-full flex transition-all duration-800`;
  const leftColumnStyles = `${baseColumnStyles}`;
  const rightColumnStyles = `${baseColumnStyles} align-middle justify-center md:justify-start content-center`;
  const spaceBetweenAmount = 18;
  return (
    <>
      {type === TwoColumnLayoutType.DEFAULT && (
        <Layout
          dotIndicatorOptions={dotIndicatorOptions}
          managerSettingsOpen={managerSettingsOpen}
          showNav={true}
          showBackButton={true}
          handleExitClick={handleExitClick}
          hideWalletAndEllipsis={hideWalletAndEllipsis}
          showCloseButton={showCloseButton}
          activeIndex={activeIndex}
          navItems={[]}
          customClasses="h-screen "
          showNavButton={showNavButton}
          showSideNav={showSideNav}
          showDotIndicatorLabels={showDotIndicatorLabels}
          handlePrevious={handlePrevious}
          handleNext={handleNext}
          nextBtnDisabled={nextBtnDisabled}
        >
          <Head title={headerTitle || 'Club'} />
          <ErrorBoundary>
            <div className="w-full">
              <div className="container md:mx-auto">
                {/* Two Columns (Syndicate Details + Widget Cards) */}
                <div className="grid grid-cols-12 gap-5">
                  {/* Left Column */}
                  <div
                    className={`md:col-start-1 ${
                      managerSettingsOpen ? 'md:col-end-8' : 'md:col-end-7'
                    } col-span-12`}
                  >
                    <div className="w-full mt-5">{leftColumnComponent}</div>
                    <div className="w-full flex md:hidden mt-8">
                      {rightColumnComponent}
                    </div>
                  </div>
                  {/* Right Column */}
                  <div className="md:col-end-13 md:col-span-5 col-span-12 hidden md:flex justify-end items-start pt-0 h-full">
                    <div className="sticky top-33 w-full max-w-120">
                      {rightColumnComponent}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ErrorBoundary>
        </Layout>
      )}
      {type === TwoColumnLayoutType.FLEX && (
        <Layout
          dotIndicatorOptions={dotIndicatorOptions}
          managerSettingsOpen={managerSettingsOpen}
          showNav={true}
          showBackButton={true}
          handleExitClick={handleExitClick}
          hideWalletAndEllipsis={hideWalletAndEllipsis}
          showCloseButton={showCloseButton}
          activeIndex={activeIndex}
          navItems={[]}
          customClasses="h-screen "
          showNavButton={showNavButton}
          showSideNav={showSideNav}
          showDotIndicatorLabels={showDotIndicatorLabels}
          handlePrevious={handlePrevious}
          handleNext={handleNext}
          nextBtnDisabled={nextBtnDisabled}
        >
          <Head title={headerTitle || 'Club'} />
          <ErrorBoundary>
            <div className="w-full h-full flex justify-center md:block">
              <div className="container md:mx-auto h-full">
                <div className="md:flex justify-around space-y-24 md:space-y-0 md:space-x-18 h-full items-center">
                  <div
                    className={`${
                      flipColumns ? rightColumnStyles : leftColumnStyles
                    } ${flipColumns ? 'push-left-column-18' : 'translate-x-0'}`}
                  >
                    {leftColumnComponent}
                  </div>
                  <div
                    className={`${
                      flipColumns ? leftColumnStyles : rightColumnStyles
                    } ${
                      flipColumns ? 'push-right-column-18' : 'translate-x-0'
                    }`}
                  >
                    {rightColumnComponent}
                  </div>
                </div>
              </div>
            </div>
          </ErrorBoundary>
        </Layout>
      )}
    </>
  );
};

export default TwoColumnLayout;
