import ErrorBoundary from '@/components/errorBoundary';
import Layout from '@/components/layout';
import Head from '@/components/syndicates/shared/HeaderTitle';
import { useTailwindScreenWidth } from '@/helpers/layout';
import useWindowSize from '@/hooks/useWindowSize';
import { FC, ReactChild, ReactChildren } from 'react';

export enum TwoColumnLayoutType {
  DEFAULT = 'DEFAULT',
  FLEX = 'FLEX',
  EQUAL_COLUMNS = 'EQUAL_COLUMNS'
}

const TwoColumnLayout: FC<{
  dotIndicatorOptions: string[];
  managerSettingsOpen: boolean;
  leftColumnComponent: any;
  rightColumnComponent: any;
  fullComponent?: ReactChild | ReactChildren;
  handleExitClick?: any;
  hideWallet?: boolean;
  hideEllipsis?: boolean;
  hideFooter?: boolean;
  showCloseButton?: boolean;
  keepLogoCentered?: boolean;
  headerTitle: string;
  activeIndex?: number;
  type?: TwoColumnLayoutType;
  showNavButton?: boolean;
  flipColumns?: boolean;
  showSideNav?: boolean;
  gridGapClass?: string;
  showDotIndicatorLabels?: boolean;
  handlePrevious?: (event?: any) => void;
  handleNext?: (event?: any) => void;
  nextBtnDisabled?: boolean;
}> = ({
  managerSettingsOpen,
  leftColumnComponent,
  rightColumnComponent,
  fullComponent,
  headerTitle,
  hideFooter = false,
  activeIndex,
  showNavButton,
  handlePrevious = () => ({}),
  handleNext,
  handleExitClick = () => ({}),
  dotIndicatorOptions = [],
  hideWallet = false,
  hideEllipsis = false,
  showCloseButton = false,
  keepLogoCentered = false,
  type = TwoColumnLayoutType.DEFAULT,
  flipColumns = false,
  showSideNav = false,
  gridGapClass = 'gap-5',
  showDotIndicatorLabels = true,
  nextBtnDisabled = true
}) => {
  const baseColumnStyles = `flex-1 md:h-full flex transition-all duration-800`;
  const leftColumnStyles = `${baseColumnStyles}`;
  const rightColumnStyles = `${baseColumnStyles} align-middle justify-center md:justify-start content-center`;
  const spaceBetweenAmount = 18;
  const tailwindScreenWidthMd = useTailwindScreenWidth('md').width;
  const windowWidth = useWindowSize().width;
  const displayMobileLayout = windowWidth < tailwindScreenWidthMd;

  return (
    <>
      {type === TwoColumnLayoutType.DEFAULT && (
        <Layout
          dotIndicatorOptions={dotIndicatorOptions}
          managerSettingsOpen={managerSettingsOpen}
          showNav={true}
          showBackButton={true}
          handleExitClick={handleExitClick}
          hideWallet={hideWallet}
          hideEllipsis={hideEllipsis}
          showCloseButton={showCloseButton}
          hideFooter={hideFooter}
          keepLogoCentered={keepLogoCentered}
          activeIndex={activeIndex}
          navItems={[]}
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
              <div className="container mx-auto">
                {/* Two Columns (Syndicate Details + Widget Cards) */}
                <div className={`grid grid-cols-12 ${gridGapClass}`}>
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
              {fullComponent}
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
          hideWallet={hideWallet}
          hideEllipsis={hideEllipsis}
          showCloseButton={showCloseButton}
          hideFooter={hideFooter}
          keepLogoCentered={keepLogoCentered}
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
                      flipColumns && !displayMobileLayout
                        ? rightColumnStyles
                        : leftColumnStyles
                    } ${
                      flipColumns && !displayMobileLayout
                        ? `push-left-column-${spaceBetweenAmount}`
                        : 'translate-x-0'
                    }`}
                  >
                    {leftColumnComponent}
                  </div>
                  <div
                    className={`${
                      flipColumns && !displayMobileLayout
                        ? leftColumnStyles
                        : rightColumnStyles
                    } ${
                      flipColumns && !displayMobileLayout
                        ? `push-right-column-${spaceBetweenAmount}`
                        : 'translate-x-0'
                    }`}
                  >
                    {rightColumnComponent}
                  </div>
                </div>
              </div>
              {fullComponent}
            </div>
          </ErrorBoundary>
        </Layout>
      )}
      {type === TwoColumnLayoutType.EQUAL_COLUMNS && (
        <Layout
          dotIndicatorOptions={dotIndicatorOptions}
          managerSettingsOpen={managerSettingsOpen}
          showNav={true}
          showBackButton={true}
          handleExitClick={handleExitClick}
          hideWallet={hideWallet}
          hideEllipsis={hideEllipsis}
          showCloseButton={showCloseButton}
          hideFooter={hideFooter}
          keepLogoCentered={keepLogoCentered}
          activeIndex={activeIndex}
          navItems={[]}
          showNavButton={showNavButton}
          showSideNav={showSideNav}
          showDotIndicatorLabels={showDotIndicatorLabels}
          handlePrevious={handlePrevious}
          handleNext={handleNext}
          nextBtnDisabled={nextBtnDisabled}
        >
          <Head title={headerTitle || 'Club'} />
          <ErrorBoundary>
            <div className="w-full sm:mt-6">
              <div className="container mx-auto">
                {/* Two Columns (Syndicate Details + Widget Cards) */}
                <div className={`grid grid-cols-12 ${gridGapClass}`}>
                  {/* Left Column */}
                  <div
                    className={`col-span-12 col-start-1 md:col-span-6 1.5xl:col-span-4 1.5xl:col-start-3`}
                  >
                    {leftColumnComponent}
                  </div>

                  {/* Right Column */}
                  <div className="pt-0 col-span-12 md:col-start-7 md:col-span-6 1.5xl:col-span-4">
                    {rightColumnComponent}
                  </div>
                </div>
              </div>
              {fullComponent}
            </div>
          </ErrorBoundary>
        </Layout>
      )}
    </>
  );
};

export default TwoColumnLayout;
