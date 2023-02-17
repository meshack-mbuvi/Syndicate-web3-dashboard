import AddToCalendar from '@/components/addToCalendar';
import { UpArrowWithLine } from '@/components/icons/upArrowWithLine';
import Layout from '@/components/layout';
import Modal, { ModalStyle } from '@/components/modal';
import SEO from '@/components/seo';
import { Spinner } from '@/components/shared/spinner';
import { BlockExplorerLink } from '@/components/syndicates/shared/BlockExplorerLink';
import TransitionBetweenChildren, {
  TransitionBetweenChildrenType
} from '@/components/transition/transitionBetweenChildren';
import AmountToRaise from '@/containers/createInvestmentClub/amountToRaise/AmountToRaise';
import ClubNameSelector from '@/containers/createInvestmentClub/clubNameSelector';
import MembersCount from '@/containers/createInvestmentClub/membersCount';
import Membership from '@/containers/createInvestmentClub/membership';
import MintMaxDate from '@/containers/createInvestmentClub/mintMaxDate';
import ReviewDetails from '@/containers/createInvestmentClub/reviewDetails';
import WalletWarnings from '@/containers/createInvestmentClub/walletWarnings';
import { useCreateInvestmentClubContext } from '@/context/CreateInvestmentClubContext';
import { SUPPORTED_TOKENS } from '@/Networks';
import { AppState } from '@/state';
import { setDepositTokenDetails } from '@/state/createInvestmentClub/slice';
import { setDispatchCreateFlow } from '@/state/wallet/actions';
import moment from 'moment';
import Image from 'next/image';
import Link from 'next/link';
import router from 'next/router';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFormattedDateTimeWithTZ } from 'src/utils/dateUtils';

const CreateInvestmentClub: React.FC = () => {
  const {
    currentStep,
    waitingConfirmationModal,
    transactionModal,
    processingModalTitle,
    processingModalDescription,
    errorModal,
    warningModal,
    setShowModal,
    handleCreateInvestmentClub,
    handleBack,
    handleNext,
    nextBtnDisabled,
    resetCreationStates,
    handleGoToStep
  } = useCreateInvestmentClubContext();

  const {
    createInvestmentClubSliceReducer: {
      investmentClubName,
      mintEndTime: { value: endMintTime },
      clubCreationStatus: {
        creationReceipt: { tokenAddress },
        transactionHash
      }
    },
    web3Reducer: {
      dispatchCreateFlow,
      web3: { account, activeNetwork }
    }
  } = useSelector((state: AppState) => state);

  const dispatch = useDispatch();

  const formattedDate = getFormattedDateTimeWithTZ(endMintTime * 1000);

  const calEvent = {
    title: `${investmentClubName} closes to deposits on Syndicate`,
    description: '',
    startTime: endMintTime * 1000,
    endTime: moment(endMintTime * 1000)
      .add(1, 'days')
      .valueOf(),
    location: ''
  };

  useEffect(() => {
    if (dispatchCreateFlow && account) {
      setShowModal?.((prev) => ({
        ...prev,
        warningModal: true
      }));
    }
  }, [dispatchCreateFlow, account]);

  useEffect(() => {
    if (!activeNetwork.chainId) return;
    const defaultTokenDetails = SUPPORTED_TOKENS[activeNetwork.chainId].filter(
      (coin: any) => coin.default
    )[0];

    dispatch(
      setDepositTokenDetails({
        depositToken: defaultTokenDetails.address,
        depositTokenName: defaultTokenDetails.name,
        depositTokenSymbol: defaultTokenDetails.symbol,
        depositTokenLogo: defaultTokenDetails.logoURI,
        depositTokenDecimals: defaultTokenDetails.decimals || 18
      })
    );
  }, [activeNetwork.chainId]);

  const handleExit = (): void => {
    void router.replace('/');
    resetCreationStates?.();
  };

  const dotIndicatorOptions = [
    'Name & identity',
    'Raise amount',
    'Mint end date',
    'Members count',
    'Membership',
    'Review'
  ];

  const showBackButton = true;

  return (
    <Layout
      showCreateProgressBar={false}
      handleNext={handleNext}
      handlePrevious={handleBack}
      nextBtnDisabled={nextBtnDisabled}
      {...{
        handleGoToStep,
        showDotIndicatorsTooltip: true,
        dotIndicatorOptions,
        showSideNav: true,
        showDotIndicators: true,
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
        handleExitClick: (): void => handleExit()
      }}
    >
      <SEO
        title="Create Investment Club"
        keywords={['syndicate', 'investment', 'club', 'fund', 'crypto']}
        image="/images/social/create-club.png"
      />
      <div className="w-full container mx-auto flex items-center justify-center">
        <div className="md:px-12 lg:px-16">
          <TransitionBetweenChildren
            visibleChildIndex={currentStep ? currentStep : 0}
            transitionType={TransitionBetweenChildrenType.VERTICAL_MOVE}
            extraClasses="h-full"
            transitionDurationClassOverride="duration-800"
          >
            <ClubNameSelector />
            <AmountToRaise />
            <MintMaxDate />
            <MembersCount />
            <Membership />
            <ReviewDetails />
          </TransitionBetweenChildren>
        </div>
      </div>

      {/* Waiting for confirmation Modal */}
      <Modal
        show={waitingConfirmationModal ?? false}
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

      {/* Transaction submitted Modal */}
      <Modal
        show={transactionModal ?? false}
        modalStyle={ModalStyle.DARK}
        showCloseButton={false}
        customWidth="w-11/12 md:w-1/2 lg:w-1/3"
        // passing empty string to remove default classes
        customClassName=""
      >
        {/* -mx-4 is used to revert the mx-4 set on parent div on the modal */}
        <div className="flex flex-col py-10 -mx-4 px-8">
          {/* passing empty margin to remove the default margin set on spinner */}
          <div className="flex flex-col justify-center">
            <Image
              height="64"
              width="64"
              className="m-auto"
              src="/images/checkCircleGreen.svg"
              alt=""
            />

            <p className="text-xl text-center mt-8 mb-2 text-white font-whyte leading-8">
              Welcome on-chain, {investmentClubName}
            </p>
            <p className="text-sm text-center mb-6 text-white font-whyte">
              Accepting deposits until {formattedDate}
            </p>
            <div className="flex justify-center mb-6 text-sm text-center leading-4 text-blue-navy font-whyte ml-2">
              <AddToCalendar calEvent={calEvent} />
            </div>
          </div>
          <div className="self-center pt-6 pb-3">
            <Link
              href={`/clubs/${tokenAddress}/manage?source=create${
                '&chain=' + activeNetwork.network
              }`}
            >
              <span className="px-8 py-4 bg-white rounded-md text-black text-center text-base cursor-pointer self-center w-1/2">
                View club dashboard
              </span>
            </Link>
          </div>
        </div>
      </Modal>

      {/* Error modal */}
      <Modal
        show={errorModal ?? false}
        modalStyle={ModalStyle.DARK}
        closeModal={() =>
          setShowModal?.(() => ({
            waitingConfirmationModal: false,
            transactionModal: false,
            errorModal: false,
            warningModal: false
          }))
        }
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
            Club creation failed
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
                onClick={handleCreateInvestmentClub}
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Wallet warning modals */}
      <Modal
        show={warningModal ?? false}
        modalStyle={ModalStyle.DARK}
        closeModal={() => {
          setShowModal?.(() => ({
            waitingConfirmationModal: false,
            transactionModal: false,
            errorModal: false,
            warningModal: false
          }));
          dispatch(setDispatchCreateFlow(false));
        }}
        showCloseButton={false}
        outsideOnClick={true}
        customWidth="w-11/12 sm:w-100 md:w-1/2 lg:w-100"
        customClassName="py-8 px-10"
        showHeader={false}
      >
        <WalletWarnings />
      </Modal>
    </Layout>
  );
};

export default CreateInvestmentClub;
