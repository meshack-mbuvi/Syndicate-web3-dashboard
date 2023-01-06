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
import useDealsPrecommits from '@/hooks/deals/useDealPrecommits';
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

export const DealSidePanel: React.FC<{
  permissionType: PermissionType | null;
  isOpenToPrecommits: boolean;
  setIsReviewingCommittments: Dispatch<SetStateAction<boolean>>;
  isReviewingCommittments: boolean;
}> = ({
  permissionType,
  isOpenToPrecommits,
  setIsReviewingCommittments,
  isReviewingCommittments
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
  const [openExecuteModal, setOpenExecuteModal] = useState(false);

  // executing deal

  const [isExecutingDeal, setIsExecutingDeal] = useState<boolean>(false);
  const [isConfirmingExecution, setIsConfirmingExecution] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [successfullyExecutedDeal, setSuccessfullyExecutedDeal] =
    useState(false);
  const [dealExecutionFailed, setDealExecutionFailed] = useState(false);

  const { precommits: participants } = useDealsPrecommits();
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
    setOpenExecuteModal(true);
  };
  const handleCloseModalClick = (): void => {
    setOpenExecuteModal(false);
    setIsExecutingDeal(false);
    setSuccessfullyExecutedDeal(false);
    setIsConfirmingExecution(false);
    setDealExecutionFailed(false);
  };

  //TODO: open modal to initiate dissolving deal
  const handleDissolveDealClick = (): void => {
    dissolveDeal();
  };

  /** calls to handle execution of deal */
  const onTxFail = (): void => {
    setDealExecutionFailed(true);
  };

  const onTxConfirm = (): void => {
    setIsConfirmingExecution(false);
    setIsExecutingDeal(true);
  };

  const onTxReceipt = (receipt?: TransactionReceipt): void => {
    console.log('receipt', receipt);
    setSuccessfullyExecutedDeal(true);
    setIsExecutingDeal(false);
    setOpenExecuteModal(false);
  };

  const handleExecuteDeal = async (): Promise<void> => {
    setIsConfirmingExecution(true);

    //TODO: add functionality to select/remove participants rather than accepting all
    const addresses = participants.map((participant) => participant.address);

    await allowancePrecommitModuleERC20.executePrecommits(
      dealTokenAddress,
      account,
      addresses,
      onTxConfirm,
      onTxReceipt,
      onTxFail
    );
  };

  /** TODO: add functionality to handle dissolving of deal */
  const dissolveDeal = (): void => {
    console.log('dissolving deal');
  };

  return (
    <div className="space-y-8 mt-5">
      {/* input field component for precommit amount  */}
      <div>
        {isOpenToPrecommits && (
          <PrecommitContainer {...{ dealDetails, dealDetailsLoading }} />
        )}
      </div>

      {/* card to show amount backed once precommit is accepted  */}
      <UponAllocationAcceptance
        {...{
          dealCommitTokenLogo: '/images/usdcIcon.svg',
          dealCommitTokenSymbol: 'USDC',
          dealTokenLogo: '/images/logo.svg',
          dealTokenSymbol: 'PRVX'
        }}
      />

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

      {/* deal execution modal  */}
      <DealCloseModal
        {...{
          show: openExecuteModal,
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
          handleDealCloseClick: handleExecuteDeal,
          closeType: DealEndType.EXECUTE,
          showWaitingOnExecutionLoadingState: isExecutingDeal,
          transactionFailed: dealExecutionFailed
        }}
      />

      {/* Execution success modal  */}
      {successfullyExecutedDeal ? (
        <div className="fixed inset-0 z-30 bg-black bg-opacity-90">
          <div className="space-y-16 flex flex-col w-full h-full justify-center items-center">
            {/* success title  */}
            <H1 extraClasses="text-white">You closed your deal!</H1>

            <DealsMilestoneOverview
              {...{
                dealName,
                dealDetails: /* details ? details :  */ '',
                ensName: destinationEnsName,
                destinationAddress: dealDestination,
                commitmentGoalAmount: getWeiAmount(totalCommitted, 6, false),
                commitmentGoalTokenSymbol: 'USDC',
                commitmentGoalTokenLogo: '/images/prodTokenLogos/USDCoin.svg',
                milestoneType: DealMilestoneType.EXECUTED
              }}
            />

            <CTAButton
              onClick={(): void => {
                setSuccessfullyExecutedDeal(false);
              }}
              fullWidth={false}
              type={CTAType.PRIMARY}
            >
              Return to deal page
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
