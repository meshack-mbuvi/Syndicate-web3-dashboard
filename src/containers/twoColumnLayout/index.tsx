import ErrorBoundary from '@/components/errorBoundary';
import Layout from '@/components/layout';
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
  setActiveIndex?: (index?: number) => void;
  type?: TwoColumnLayoutType;
  showNavButton?: boolean;
}> = ({
  managerSettingsOpen,
  leftColumnComponent,
  rightColumnComponent,
  headerTitle,
  activeIndex,
  setActiveIndex,
  handleExitClick = () => ({}),
  dotIndicatorOptions = [],
  hideWalletAndEllipsis = false,
  showCloseButton = false,
  type = TwoColumnLayoutType.DEFAULT,
  showNavButton
}) => {
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
          setActiveIndex={setActiveIndex}
          navItems={[]}
          customClasses="h-screen "
          showNavButton={showNavButton}
        >
          <Head title={headerTitle || 'Club'} />
          <ErrorBoundary>
            <div className="w-full h-full">
              <div className="container mx-auto h-full">
                <div className="flex justify-around space-x-18 h-full items-center">
                  <div className="flex-1 h-full flex">
                    {leftColumnComponent}
                  </div>
                  <div className="flex-1 h-full flex justify-around content-center">
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
