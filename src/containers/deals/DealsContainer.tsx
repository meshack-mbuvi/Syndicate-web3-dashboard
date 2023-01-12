import { PermissionType } from '@/components/collectives/shared/types';
import Modal, { ModalStyle } from '@/components/modal';
import { useEffect, useState } from 'react';
import { Spinner } from '@/components/shared/spinner';
import { SkeletonLoader } from '@/components/skeletonLoader';
import { Status } from '@/components/statusChip';
import { BlockExplorerLink } from '@/components/syndicates/shared/BlockExplorerLink';
import { DealSidePanel } from '@/containers/deals/dealSidePanel';
import { DealsContainer } from '@/features/deals/components';
import { DealsAllocations } from '@/features/deals/components/allocations';
import { DealsOverview } from '@/features/deals/components/overview';
import { DealsParticipants } from '@/features/deals/components/participants';
import {
  DealsParticipantsTable,
  Participant
} from '@/features/deals/components/participants/table';
import { useDealPermissionType } from '@/hooks/deals/useDealPermissionType';
import useDealsPrecommits from '@/hooks/deals/useDealPrecommits';
import useDealsDetails from '@/hooks/deals/useDealsDetails';
import useTokenDetails from '@/hooks/useTokenDetails';
import { getWeiAmount } from '@/utils/conversions';
import moment from 'moment';
import TwoColumnLayout from '../twoColumnLayout';

const DealDetails: React.FC = () => {
  const {
    dealDetails: {
      dealName,
      dealDescription,
      dealTokenAddress,
      depositToken,
      goal,
      dealDestination,
      ownerAddress,
      totalCommitments,
      totalCommitted,
      dealEndTime,
      isClosed
    },
    dealDetailsLoading
  } = useDealsDetails();

  const [isReviewingCommittments, setIsReviewingCommittments] = useState(false);

  const { precommits: participants } = useDealsPrecommits();

  const { symbol: depositTokenSymbol, logo: depositTokenLogo } =
    useTokenDetails(depositToken);

  const permissionType = useDealPermissionType();
  const [currentParticipants, setCurrentParticipants] = useState<Participant[]>(
    []
  );

  // need to have the right object shape for participants and also
  // handle reject/acceptance of precommits
  useEffect(() => {
    const _currentParticipants = participants.map((participant) => {
      return {
        address: participant.address,
        contributionAmount: getWeiAmount(participant.amount, 6, false),
        ensName: '',
        joinedDate: moment
          .utc(+participant.createdAt * 1000)
          .format('DD/MM/YY'),
        status: Status.ACCEPTED
      };
    });

    setCurrentParticipants(_currentParticipants);
  }, [participants]);

  const updateParticipantStatus = (idx: number, status: Status): void => {
    setCurrentParticipants((current) =>
      current.map((participant, index) => {
        if (idx === index) {
          return { ...participant, status };
        }
        return participant;
      })
    );
  };

  const isOpenToPrecommits =
    new Date(+dealEndTime * 1000).getTime() > Date.now() && !isClosed;

  // skeleton loader content for left content
  const leftColumnLoader = (
    <div className="space-y-10">
      {dealDetailsLoading && dealName ? (
        <div>TODO</div>
      ) : (
        // <HeaderComponent showModifySettings={false} />
        <div className="flex items-center justify-start space-x-4 w-full">
          <SkeletonLoader width="3/5" height="8" />
          <SkeletonLoader width="8" height="8" borderRadius="rounded-full" />
          <SkeletonLoader width="8" height="8" borderRadius="rounded-full" />
          <SkeletonLoader width="8" height="8" borderRadius="rounded-full" />
        </div>
      )}
      <div className="flex items-center justify-start flex-wrap">
        <div className="flex space-x-4 w-full">
          <SkeletonLoader width="1/3" height="5" />
          <SkeletonLoader width="2/3" height="5" />
        </div>
        <div className="flex space-x-4 w-full">
          <SkeletonLoader width="2/3" height="5" />
          <SkeletonLoader width="1/3" height="5" />
        </div>
        <div className="flex space-x-4 w-full">
          <SkeletonLoader width="1/3" height="5" />
          <SkeletonLoader width="2/3" height="5" />
        </div>
      </div>
      <SkeletonLoader width="full" height="24" borderRadius="rounded-2.5xl" />
      {dealDetailsLoading && dealName ? (
        <Modal
          show={true}
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
              Preparing collective
            </p>
            <div className="font-whyte text-center leading-5 text-base text-gray-lightManatee">
              This could take up to a few minutes. You can safely leave this
              page while you wait.
            </div>

            <div className="flex justify-center mt-4">
              <BlockExplorerLink
                resourceId={dealTokenAddress}
                resource="address"
              />
            </div>
          </div>
        </Modal>
      ) : null}
    </div>
  );

  // skeleton loader for right column
  const rightColumnLoader = (
    <div className="space-y-12 mt-7">
      <div className="space-y-4">
        <SkeletonLoader width="1/3" height="5" />
        <SkeletonLoader width="full" height="12" />
      </div>
      <div className="space-y-4">
        <SkeletonLoader width="1/3" height="5" />
        <SkeletonLoader width="full" height="48" />
      </div>
    </div>
  );

  return (
    <DealsContainer>
      <TwoColumnLayout
        hideWallet={false}
        hideEllipsis={false}
        showCloseButton={false}
        headerTitle={dealName ?? 'Deal'}
        managerSettingsOpen={true}
        dotIndicatorOptions={[]}
        leftColumnComponent={
          <div>
            {dealDetailsLoading ? (
              leftColumnLoader
            ) : (
              <div className="flex flex-col space-y-6">
                <DealsOverview
                  dealName={dealName}
                  dealDetails={dealDescription}
                  destinationAddress={dealDestination}
                  commitmentGoalAmount={goal}
                  commitmentGoalTokenSymbol={depositTokenSymbol}
                  commitmentGoalTokenLogo={
                    depositTokenLogo
                      ? depositTokenLogo
                      : '/images/prodTokenLogos/USDCoin.svg'
                  }
                />
                <DealsAllocations
                  leaderAddress={ownerAddress}
                  numberOfParticipants={parseInt(totalCommitments)}
                  totalAllocatedAmount={parseFloat(
                    getWeiAmount(totalCommitted, 6, false)
                  )}
                  tokenSymbol={depositTokenSymbol}
                  tokenIcon={
                    depositTokenLogo
                      ? depositTokenLogo
                      : '/images/prodTokenLogos/USDCoin.svg'
                  }
                  dealEndTime={Number(dealEndTime) * 1000}
                  isDealExecuted={isClosed}
                  isReviewingCommittments={
                    isReviewingCommittments &&
                    permissionType === PermissionType.ADMIN
                  }
                />
                {/* Heat map goes here */}
                {isReviewingCommittments &&
                permissionType === PermissionType.ADMIN ? (
                  <DealsParticipantsTable
                    handleParticipantAcceptanceClick={(index: number): void => {
                      updateParticipantStatus(index, Status.ACCEPTED);
                    }}
                    handleParticipantRejectionClick={(index: number): void => {
                      updateParticipantStatus(index, Status.REJECTED);
                    }}
                    participants={currentParticipants}
                    tokenLogo="/images/prodTokenLogos/USDCoin.svg"
                    tokenSymbol="USDC"
                    totalParticipantsAmount={getWeiAmount(
                      totalCommitted,
                      6,
                      false
                    )}
                  />
                ) : (
                  <DealsParticipants participants={participants} />
                )}
              </div>
            )}
          </div>
        }
        rightColumnComponent={
          dealDetailsLoading ? (
            rightColumnLoader
          ) : (
            <DealSidePanel
              isClosed={isClosed}
              {...{
                permissionType,
                isOpenToPrecommits,
                setIsReviewingCommittments,
                isReviewingCommittments,
                currentParticipants
              }}
            />
          )
        }
      />
    </DealsContainer>
  );
};

export default DealDetails;
