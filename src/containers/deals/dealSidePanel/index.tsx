import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import UponAllocationAcceptance from '@/features/deals/components/details/uponAllocationAcceptance';
import DealDetailsAdminTools from '@/features/deals/components/details/adminTools';
import { B3 } from '@/components/typography';
import Image from 'next/image';
import CopyLink from '@/components/shared/CopyLink';
import { useRouter } from 'next/router';
import { PermissionType } from '@/components/collectives/shared/types';
import DealCloseModal from '@/features/deals/components/close/execute';
import DealCloseConfirmModal from '@/features/deals/components/close/confirm';
import PrecommitContainer from '@/containers/deals/precommit/PrecommitContainer';
import { useSelector } from 'react-redux';
import { AppState } from '@/state';
import useDealsDetails from '@/hooks/deals/useDealsDetails';
import { getWeiAmount } from '@/utils/conversions';
import { floatedNumberWithCommas } from '@/utils/formattedNumbers';
import useFetchEnsAssets from '@/hooks/useFetchEnsAssets';
import { formatAddress } from '@/utils/formatAddress';
import { H1 } from '@/components/typography';
import { CTAButton, CTAType } from '@/components/CTAButton';
import { DealEndType } from '@/features/deals/components/close/types';
import { DealsMilestoneOverview } from '@/features/deals/components/create/milestone';
import { DealMilestoneType } from '@/features/deals/components/create/milestone/types';
import { Participant } from '@/features/deals/components/participants/table';
import { Status } from '@/components/statusChip';
import DealActionConfirmModal from '@/features/deals/components/close/confirm';
import { InactiveDealCard } from './inactiveDealCard';
import useMemberPrecommit from '@/hooks/deals/useMemberPrecommit';
import { PrecommitStatus } from '@/hooks/deals/types';

export const DealSidePanel: React.FC<{
  permissionType: PermissionType | null;
  isClosed: boolean;
  isOpenToPrecommits: boolean;
  setIsReviewingCommittments: Dispatch<SetStateAction<boolean>>;
  isReviewingCommittments: boolean;
  currentParticipants: Participant[];
}> = ({
  permissionType,
  isClosed,
  isOpenToPrecommits,
  setIsReviewingCommittments,
  isReviewingCommittments,
  currentParticipants
}) => {
  const {
    web3Reducer: {
      web3: { account, ethersProvider }
    },
    initializeContractsReducer: {
      syndicateContracts: { allowancePrecommitModuleERC20 }
    }
  } = useSelector((state: AppState) => state);
  const router = useRouter();
  const { isReady } = router;

  const [copyState, setCopyState] = useState(false);
  const [dealLink, setDealLink] = useState('');
  const [openActionModal, setOpenActionModal] = useState(false);
  const [isDealCloseModalOpen, setDealCloseModalOpen] = useState(false);
  const [closeDealType, setCloseDealType] = useState<DealEndType>(
    DealEndType.EXECUTE
  );

  // executing deal
  const [isExecutingDeal, setIsExecutingDeal] = useState<boolean>(false);
  const [isConfirmingExecution, setIsConfirmingExecution] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [successfullyClosedDeal, setSuccessfullyClosedDeal] = useState(false);
  const [dealExecutionFailed, setDealExecutionFailed] = useState(false);

  const { dealDetails, dealDetailsLoading } = useDealsDetails();
  const { dealName, dealTokenAddress, dealDestination, totalCommitted } =
    dealDetails;
  const { data } = useFetchEnsAssets(dealDestination, ethersProvider);
  const destinationEnsName = data?.name
    ? data.name
    : formatAddress(dealDestination, 6, 4);

  useEffect(() => {
    if (isReady) {
      setDealLink(window.location.href);
    }
  }, [isReady]);

  const handleUpdateCopyState = (): void => {
    setCopyState(true);

    setTimeout(() => {
      setCopyState(false);
    }, 1000);
  };

  // open/close modal to initiate executing deal
  const handleExecuteDealClick = (): void => {
    setDealCloseModalOpen(true);
  };
  const handleCloseModalClick = (): void => {
    setDealCloseModalOpen(false);
    setIsExecutingDeal(false);
    setSuccessfullyClosedDeal(false);
    setIsConfirmingExecution(false);
    setDealExecutionFailed(false);
  };

  // open modal to validate whether to dissolve deal
  const handleDissolveDealClick = (): void => {
    setCloseDealType(DealEndType.DISSOLVE);
    setOpenActionModal(true);
  };

  /** calls to handle execution of deal */
  const onTxFail = (): void => {
    setDealExecutionFailed(true);
  };

  const onTxConfirm = (): void => {
    setIsConfirmingExecution(false);
    setIsExecutingDeal(true);
  };

  const onTxReceipt = (): void => {
    setSuccessfullyClosedDeal(true);
    setIsExecutingDeal(false);
    setDealCloseModalOpen(false);
  };

  const handleExecuteDeal = async (): Promise<void> => {
    setIsConfirmingExecution(true);

    const addresses = currentParticipants
      .filter((participant) => participant.status === Status.ACCEPTED)
      .map((_participant) => _participant.address || '');

    await allowancePrecommitModuleERC20.executePrecommits(
      dealTokenAddress,
      account,
      addresses,
      onTxConfirm,
      onTxReceipt,
      onTxFail
    );
  };

  const handleDissolveDeal = async (): Promise<void> => {
    setIsConfirmingExecution(true);

    await allowancePrecommitModuleERC20.executePrecommits(
      dealTokenAddress,
      account,
      [],
      onTxConfirm,
      onTxReceipt,
      onTxFail
    );
  };

  // disable execute button if all commits are rejected
  const disableExecuteButton =
    currentParticipants.filter(
      (participant) => participant.status === Status.ACCEPTED
    ).length < 1 || isClosed;
  const disableDissolveButton = isClosed;

  const { precommit, precommitLoading } = useMemberPrecommit();

  //check if deal was executed or dissolved.
  const isDealDissolved =
    !currentParticipants.some(
      (participant) =>
        participant.precommitStatus === PrecommitStatus.FAILED ||
        participant.precommitStatus === PrecommitStatus.EXECUTED
    ) && isClosed;

  // show inactive deal status if deal is closed (dissolved or executed) for non-members or admin (if admin has no precommit)
  // precommit object is undefined if connected account has no precommits
  if (!precommitLoading && !precommit && isClosed) {
    return (
      <InactiveDealCard isDealDissolved={isDealDissolved} dealName={dealName} />
    );
  }

  return (
    <div className="space-y-8 mt-5">
      {/* input field component for precommit amount  */}
      <>
        {isOpenToPrecommits && (
          <PrecommitContainer {...{ dealDetails, dealDetailsLoading }} />
        )}
      </>

      {/* card to show amount backed once precommit is accepted  or rejected - meaning deal is closed */}
      {isClosed && precommit && +precommit?.amount > 0 && (
        <UponAllocationAcceptance
          {...{
            dealCommitTokenLogo: '/images/usdcIcon.svg',
            dealCommitTokenSymbol: 'USDC',
            dealTokenLogo: '/images/logo.svg',
            dealTokenSymbol: 'PRVX',
            connectedWallet: { address: account, avatar: '' },
            precommitAmount: precommit ? precommit.amount : '0',
            dealName,
            status: precommit ? precommit.status : PrecommitStatus.PENDING
          }}
        />
      )}

      {/* admin CTAs to dissolve or execute deal  */}
      {permissionType === PermissionType.ADMIN ? (
        <DealDetailsAdminTools
          handleExecuteDealClick={
            isReviewingCommittments
              ? handleExecuteDealClick
              : (): void => setIsReviewModalOpen(true)
          }
          handleDissolveDealClick={handleDissolveDealClick}
          hideExecuteButton={false}
          disableExecuteButton={disableExecuteButton}
          disableDissolveButton={disableDissolveButton}
        />
      ) : null}

      {/* share deal link component. Available to both admins and members  */}
      <div className="rounded-2.5xl bg-gray-syn8">
        <div className="p-1">
          <CopyLink
            link={dealLink}
            updateCopyState={handleUpdateCopyState}
            showCopiedState={copyState}
            accentColor="white"
            backgroundColor="bg-black"
            borderColor="border-none"
            borderRadius="rounded-2xl"
            copyBorderRadius="rounded-lg"
          />
        </div>
        <div className="flex p-4 pb-3 space-x-4">
          <div className="flex items-center space-x-2">
            <Image
              src="/images/managerActions/create_public_profile.svg"
              alt="Globe"
              width={16}
              height={16}
            />
          </div>
          <div>
            <B3>Unrestricted</B3>
            <B3 extraClasses="text-gray-syn4">Anyone with the link can join</B3>
          </div>
        </div>
      </div>
      {/* deal action confirm modal*/}
      <DealActionConfirmModal
        show={openActionModal}
        closeType={closeDealType}
        handleContinueClick={(): void => {
          setDealCloseModalOpen(true);
          setOpenActionModal(false);
        }}
        handleCancelAndGoBackClick={(): void => {
          setOpenActionModal(false);
          setCloseDealType(DealEndType.EXECUTE);
        }}
      />
      {/* deal execution / dissolve modal  */}
      <DealCloseModal
        {...{
          show: isDealCloseModalOpen,
          closeModal: (): void => {
            handleCloseModalClick();
          },
          outsideOnClick: true,
          dealName,
          showWaitingOnWalletLoadingState: isConfirmingExecution,
          tokenLogo: '/images/prodTokenLogos/USDCoin.svg',
          tokenSymbol: 'USDC',
          tokenAmount: floatedNumberWithCommas(
            getWeiAmount(totalCommitted, 6, false)
          ),
          destinationEnsName,
          destinationAddress: dealDestination,
          handleDealCloseClick: isDealCloseModalOpen
            ? handleExecuteDeal
            : handleDissolveDeal,
          closeType: closeDealType,
          showWaitingOnExecutionLoadingState: isExecutingDeal,
          transactionFailed: dealExecutionFailed
        }}
      />

      {/* Execution success modal  */}
      {successfullyClosedDeal ? (
        <div className="fixed inset-0 z-30 bg-black bg-opacity-90">
          <div className="space-y-16 flex flex-col w-full h-full justify-center items-center">
            {/* success title  */}
            {closeDealType !== DealEndType.DISSOLVE && (
              <H1 extraClasses="text-white">You closed your deal!</H1>
            )}

            <DealsMilestoneOverview
              {...{
                dealName,
                dealDetails: /* details ? details :  */ '',
                ensName: destinationEnsName,
                destinationAddress: dealDestination,
                commitmentGoalAmount: getWeiAmount(totalCommitted, 6, false),
                commitmentGoalTokenSymbol: 'USDC',
                commitmentGoalTokenLogo: '/images/prodTokenLogos/USDCoin.svg',
                milestoneType:
                  closeDealType === DealEndType.DISSOLVE
                    ? DealMilestoneType.DISSOLVED
                    : DealMilestoneType.EXECUTED
              }}
            />

            <CTAButton
              onClick={(): void => {
                handleCloseModalClick();
                if (closeDealType === DealEndType.DISSOLVE) {
                  router.push('/');
                }
              }}
              fullWidth={false}
              type={CTAType.PRIMARY}
            >
              {closeDealType === DealEndType.DISSOLVE
                ? 'Return to portfolio page'
                : 'Return to deal page'}
            </CTAButton>
          </div>
        </div>
      ) : null}

      {/* close confirmation modal  */}
      <DealCloseConfirmModal
        show={isReviewModalOpen}
        handleCancelAndGoBackClick={(): void => {
          setIsReviewModalOpen(false);
        }}
        handleContinueClick={(): void => {
          setIsReviewModalOpen(false);
          setIsReviewingCommittments(true);
        }}
      />
    </div>
  );
};
