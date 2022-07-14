import ErrorBoundary from '@/components/errorBoundary';
import Layout from '@/components/layout';
import Head from '@/components/syndicates/shared/HeaderTitle';
import React, { FC } from 'react';

const TwoColumnLayout: FC<{
  dotIndicatorOptions: string[];
  managerSettingsOpen: boolean;
  leftColumnComponent;
  rightColumnComponent;
  handleExitClick?;
  headerComponent; // For most cases, this will be the club Header component
  hideWalletAndEllipsis?: boolean;
  showCloseButton?: boolean;
  headerTitle: string;
  activeIndex?: number;
  setActiveIndex?: (index?: number) => void;
}> = ({
  managerSettingsOpen,
  leftColumnComponent,
  rightColumnComponent,
  headerTitle,
  headerComponent,
  activeIndex,
  setActiveIndex,
  handleExitClick = () => ({}),
  dotIndicatorOptions = [],
  hideWalletAndEllipsis = false,
  showCloseButton = false
}) => {
  return (
    <>
      <Layout
        dotIndicatorOptions={dotIndicatorOptions}
        managerSettingsOpen={managerSettingsOpen}
        showNav={true}
        showBackButton={true}
        handleExitClick={handleExitClick}
        hideWalletAndEllipsis={hideWalletAndEllipsis}
        showCloseButton={showCloseButton}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
      >
        <Head title={headerTitle || 'Club'} />
        <ErrorBoundary>
          <div className="w-full">
            <div className="container mx-auto">
              {/* Two Columns (Syndicate Details + Widget Cards) */}
              <div className="grid grid-cols-12 gap-5">
                {/* Left Column */}
                <div
                  className={`md:col-start-1 ${
                    managerSettingsOpen ? 'md:col-end-8' : 'md:col-end-7'
                  } col-span-12`}
                >
                  {headerComponent}

                  {/* Show distribution or syndicateDetails components */}

                  <div className="w-full mt-5">{leftColumnComponent}</div>
                  <div className="w-full md:hidden mt-8">
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
    </>
  );
};

export default TwoColumnLayout;
