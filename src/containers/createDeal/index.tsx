import { CTAButton, CTAType } from '@/components/CTAButton';
import { UpArrowWithLine } from '@/components/icons/upArrowWithLine';
import Layout from '@/components/layout';
import Modal, { ModalStyle } from '@/components/modal';
import { Spinner } from '@/components/shared/spinner';
import { BlockExplorerLink } from '@/components/syndicates/shared/BlockExplorerLink';
import TransitionBetweenChildren, {
  TransitionBetweenChildrenType
} from '@/components/transition/transitionBetweenChildren';
import { H1 } from '@/components/typography';
import { AboutDeal } from '@/containers/createDeal/about';
import { DealGoal } from '@/containers/createDeal/goal';
import { DealParticipationToken } from '@/containers/createDeal/participationToken';
import { ReviewDealDetails } from '@/containers/createDeal/review';
import { DealWindow } from '@/containers/createDeal/window';
import { useCreateDealContext } from '@/context/createDealContext';
import { DealsMilestoneOverview } from '@/features/deals/components/create/milestone';
import { floatedNumberWithCommas } from '@/utils/formattedNumbers';
import Image from 'next/image';
import router from 'next/router';

export const CreateDealContainer: React.FC = () => {
  const {
    name,
    // details,
    destinationAddress,
    commitmentGoal,
    commitmentGoalTokenSymbol,
    commitmentGoalTokenLogo,
    currentStep,
    isReviewStep,
    isSuccessStep,
    handleBack,
    handleCreateDeal,
    setShowModal,
    resetCreateFlowState,
    handleGoToStep,
    showErrorModal,
    showBackButton,
    processingModalTitle,
    processingModalDescription,
    transactionHash,
    showAwaitingConfirmationModal,
    dealUrl,
    ensName
  } = useCreateDealContext();

  const dotIndicatorOptions = [
    'Name and details',
    'Deal goal',
    'Backer window',
    'Deal token'
  ];
  const goToDealPage = (): void => {
    if (dealUrl) void router.replace(dealUrl);
  };

  return (
    <Layout
      {...{
        handleGoToStep,
        showDotIndicatorsTooltip: true,
        dotIndicatorOptions,
        showSideNav: !isSuccessStep,
        showDotIndicators: isReviewStep || isSuccessStep ? false : true,
        showDotIndicatorLabels: false,
        showSideNavButton: false,
        sideNavLogo: showBackButton ? (
          <button
            className={`flex rounded-full items-center justify-center w-10 h-10 bg-gray-syn7 hover:text-white`}
            onClick={handleBack}
          >
            <UpArrowWithLine
              textColorClass="text-gray-syn4"
              extraClasses="hover:text-white"
            />
          </button>
        ) : (
          <></>
        ),
        hideFooter: true,
        customClasses: 'h-screen items-center',
        activeIndex: currentStep,
        handleExitClick: (): void => {
          void router.push('/');
          // reset state
          resetCreateFlowState && resetCreateFlowState();
        }
      }}
    >
      <div className="w-full container mx-auto flex items-center justify-center bg-gray-syn9">
        <div className="px-16">
          <TransitionBetweenChildren
            visibleChildIndex={currentStep ? currentStep : 0}
            transitionType={TransitionBetweenChildrenType.VERTICAL_MOVE}
            extraClasses="h-full"
            transitionDurationClassOverride="duration-800"
          >
            <AboutDeal />
            <DealGoal />
            <DealWindow />
            <DealParticipationToken />
            <ReviewDealDetails />
            <div className="space-y-16 flex flex-col justify-center items-center">
              {/* success title  */}
              <H1 extraClasses="text-white">Your deal is live!</H1>
              <DealsMilestoneOverview
                {...{
                  dealName: name ? name : '',
                  dealDetails: /* details ? details :  */ '',
                  ensName,
                  destinationAddress: destinationAddress
                    ? destinationAddress
                    : '',
                  commitmentGoalAmount: floatedNumberWithCommas(commitmentGoal),
                  commitmentGoalTokenSymbol: commitmentGoalTokenSymbol
                    ? commitmentGoalTokenSymbol
                    : 'USDC',
                  commitmentGoalTokenLogo: commitmentGoalTokenLogo
                    ? commitmentGoalTokenLogo
                    : '/images/prodTokenLogos/USDCoin.svg',
                  dealURL: `${window.location.origin}/${dealUrl ? dealUrl : ''}`
                }}
              />
              <CTAButton
                onClick={goToDealPage}
                fullWidth={false}
                type={CTAType.PRIMARY}
              >
                Continue to your deal page
              </CTAButton>
            </div>
          </TransitionBetweenChildren>
        </div>

        {/* Waiting for confirmation Modal */}
        <Modal
          // @ts-expect-error TS(2322): Type 'boolean | undefined' is not assignable to ty... Remove this comment to see the full error message
          show={showAwaitingConfirmationModal}
          modalStyle={ModalStyle.DARK}
          showCloseButton={false}
          customWidth="w-11/12 md:w-1/2 lg:w-1/3"
          // passing empty string to remove default classes
          customClassName=""
        >
          {/* -mx-4 is used to revert the mx-4 set on parent div on the modal */}
          <div className="flex flex-col justify-center py-10 -mx-4 px-8">
            {/* passing empty margin to remove the default margin set on spinner */}
            <Spinner height="h-16" width="w-16" margin="" />
            <p className="text-xl text-center mt-10 mb-4 leading-4 text-white font-whyte">
              {processingModalTitle}
            </p>
            <div className="font-whyte text-center leading-5 text-base text-gray-lightManatee">
              {processingModalDescription}
            </div>

            {transactionHash ? (
              <div className="flex justify-center mt-4">
                <BlockExplorerLink
                  resourceId={transactionHash}
                  resource="transaction"
                />
              </div>
            ) : null}
          </div>
        </Modal>

        {/* Error modal */}
        <Modal
          // @ts-expect-error TS(2322): Type 'boolean | undefined' is not assignable to ty... Remove this comment to see the full error message
          show={showErrorModal}
          modalStyle={ModalStyle.DARK}
          closeModal={(): void => {
            if (setShowModal) {
              setShowModal(() => ({
                showAwaitingConfirmationModal: false,
                showTransactionModal: false,
                showErrorModal: false,
                showWarningModal: false
              }));
            }
          }}
          showCloseButton={false}
          outsideOnClick={true}
          customWidth="w-11/12 md:w-1/2 lg:w-1/3"
          customClassName="p-0"
          showHeader={false}
        >
          <div>
            <div className="flex justify-center items-center w-full mt-10 mb-8">
              <Image
                width={64}
                height={64}
                src={'/images/syndicateStatusIcons/transactionFailed.svg'}
                alt="failed"
              />
            </div>
            <div className="flex justify-center items-center w-full text-xl">
              Deal creation failed
            </div>
            <div className="h-fit-content rounded-2-half flex justify-center items-center flex-col mt-6">
              <div>
                <p className="text-gray-syn4 px-6-percent md:px-0 text-center md:text-left">
                  Please try again and{' '}
                  <a
                    className="text-blue outline-none"
                    href="mailto:support@syndicate.io"
                    target="_blank"
                    rel="noreferrer"
                  >
                    let us know
                  </a>{' '}
                  if the issue persists.
                </p>
              </div>
              {transactionHash ? (
                <div className="mt-6">
                  <BlockExplorerLink
                    resourceId={transactionHash}
                    resource="transaction"
                  />
                </div>
              ) : null}
              <div className="mt-7 mb-10">
                <button
                  type="button"
                  className="bg-white rounded-custom text-black py-4 w-full px-8"
                  onClick={handleCreateDeal}
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </Layout>
  );
};
