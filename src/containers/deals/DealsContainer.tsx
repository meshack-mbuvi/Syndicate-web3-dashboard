import { PermissionType } from '@/components/collectives/shared/types';
import { useEffect, useState } from 'react';
import { SkeletonLoader } from '@/components/skeletonLoader';
import { Status } from '@/components/statusChip';
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
    if (participants) {
      const _currentParticipants = participants.map((participant) => {
        return {
          address: participant.address,
          contributionAmount: getWeiAmount(participant.amount, 6, false),
          ensName: '',
          joinedDate: moment
            .utc(+participant.createdAt * 1000)
            .format('DD/MM/YY'),
          status: Status.ACCEPTED,
          precommitStatus: participant.status
        };
      });

      setCurrentParticipants(_currentParticipants);
    }
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
      <div className="flex items-center justify-start space-x-4 w-full">
        <SkeletonLoader width="3/5" height="8" />
        <SkeletonLoader width="8" height="8" borderRadius="rounded-full" />
        <SkeletonLoader width="8" height="8" borderRadius="rounded-full" />
        <SkeletonLoader width="8" height="8" borderRadius="rounded-full" />
      </div>
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
        showBackButton={!dealDetailsLoading}
        isReviewingCommittments={isReviewingCommittments}
        setIsReviewingCommittments={setIsReviewingCommittments}
        keepLogoCentered={true}
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
                  <DealsParticipants
                    participants={participants}
                    addressOfLeader={ownerAddress}
                  />
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
