import { Spinner } from '@/components/shared/spinner';
import { SkeletonLoader } from '@/components/skeletonLoader';
import { useDemoMode } from '@/hooks/useDemoMode';
import useFetchTokenClaim from '@/hooks/useTokenClaim';
import { AppState } from '@/state';
import {
  getCountDownDays,
  getFormattedDateTimeWithTZ
} from '@/utils/dateUtils';
import React from 'react';
import { useSelector } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import { WalletIcon } from '../iconWrappers';
import { B2, H4 } from '../typography';

enum LABELS {
  OPEN_DEPOSITS = 'Open to deposits',
  AIRDROP = 'Airdrop Enabled',
  CLAIM = 'Claim club tokens',
  DISTRIBUTING = 'Distributing',
  OPEN = 'Open to new members',
  ACTIVE = 'Active',
  FULLY_DEPOSITED = 'Fully deposited',
  CREATING_IC = 'Creating investment club',
  CREATED_IC = 'Club successfully created',
  CREATING_IC_FAILED = 'Club creation failed',
  WAITING_DISTRIBUTION = 'Waiting for selection...',
  DEAL_OPEN = 'Open to allocations',
  DEAL_CONCLUDED = 'Deal has concluded',
  DEAL_REVIEWING_COMMITTMENTS = 'Choose who can commit to this deal'
}

interface Props {
  isManager?: boolean;
  depositsEnabled?: boolean;
  depositExceedTotal?: boolean;
  claimEnabled?: boolean;
  // collectives
  isCollective?: boolean;
  numberOfMembers?: number;
  isOpenToNewMembers?: boolean;
  // investment club creation loading states
  creatingSyndicate?: boolean;
  syndicateSuccessfullyCreated?: boolean;
  syndicateCreationFailed?: boolean;
  showConfettiSuccess?: boolean;
  isDistributing?: boolean;
  isWaitingForSelection?: boolean;
  merkleLoading?: boolean;
  hideCountdown?: boolean;
  // deals
  isDeal?: boolean;
  isOpenToAllocations?: boolean;
  dealEndTime?: number;
  isReviewingDealCommittments?: boolean;
}

const StatusBadge = (props: Props): JSX.Element => {
  const {
    depositsEnabled,
    depositExceedTotal,
    isManager = false,
    claimEnabled,
    isCollective,
    numberOfMembers,
    creatingSyndicate,
    syndicateSuccessfullyCreated,
    syndicateCreationFailed,
    showConfettiSuccess,
    isDistributing,
    isWaitingForSelection,
    isOpenToNewMembers,
    merkleLoading = false,
    hideCountdown = false,
    isDeal = false,
    isOpenToAllocations = false,
    dealEndTime,
    isReviewingDealCommittments = false
  } = props;

  const {
    erc20TokenSliceReducer: {
      erc20Token: { loading, endTime }
    }
  } = useSelector((state: AppState) => state);

  const isDemoMode = useDemoMode();

  const { loading: claimLoading } = useFetchTokenClaim(isDemoMode);

  let badgeBackgroundColor = 'bg-blue-darker';
  let badgeIcon: string | React.ReactNode = 'depositIcon.svg';

  let titleText: LABELS | string = LABELS.OPEN_DEPOSITS;
  let subTitleText = '';

  // Colors, text, icon
  if (claimEnabled) {
    badgeBackgroundColor = 'bg-green-phthalo-green';
    badgeIcon = 'claimToken.svg';
    titleText = isManager ? LABELS.AIRDROP : LABELS.CLAIM;
  } else if (isDistributing) {
    badgeBackgroundColor = 'bg-green-phthalo-green';
    titleText = LABELS.DISTRIBUTING;
    badgeIcon = 'distributeIcon.svg';
  } else if (isCollective) {
    badgeBackgroundColor = 'bg-cyan-collective';
    titleText = numberOfMembers
      ? `${numberOfMembers} member${numberOfMembers > 1 ? 's' : ''}`
      : 'Members';
    badgeIcon = 'collectiveIcon.svg';

    if (isOpenToNewMembers) {
      subTitleText = LABELS.OPEN;
    } else {
      subTitleText = '';
    }
  } else if (isDeal) {
    badgeBackgroundColor = 'bg-blue-darker';
    badgeIcon = (
      <WalletIcon className="text-blue-neptune" width={24} height={24} />
    );
    // badgeIcon = "active.svg";
  } else if (!depositsEnabled) {
    badgeBackgroundColor = 'bg-green-dark';
    badgeIcon = 'active.svg';
    titleText = LABELS.ACTIVE;
  } else if (depositExceedTotal) {
    badgeBackgroundColor = 'bg-blue-darker';
    badgeIcon = 'depositReachedIcon.svg';
    titleText = LABELS.FULLY_DEPOSITED;
  } else if (depositsEnabled) {
    badgeBackgroundColor = 'bg-blue-midnightExpress';
  }

  // states to track club creating process plus deals
  if (creatingSyndicate) {
    badgeBackgroundColor = 'bg-gray-syn8';
    badgeIcon = <Spinner width="w-6" height="h-6" margin="m-0" />;
    titleText = LABELS.CREATING_IC;
  } else if (syndicateSuccessfullyCreated && showConfettiSuccess) {
    badgeBackgroundColor = 'bg-green bg-opacity-10';
    badgeIcon = 'logo.svg';
    titleText = LABELS.CREATED_IC;
  } else if (syndicateCreationFailed) {
    badgeBackgroundColor = 'bg-red-error bg-opacity-10';
    badgeIcon = 'warning-triangle.svg';
    titleText = LABELS.CREATING_IC_FAILED;
  } else if (isDistributing && isWaitingForSelection) {
    titleText = LABELS.WAITING_DISTRIBUTION;
  } else if (isDeal && isOpenToAllocations) {
    if (!isReviewingDealCommittments) {
      titleText = LABELS.DEAL_OPEN;
    } else if (isReviewingDealCommittments) {
      titleText = LABELS.DEAL_REVIEWING_COMMITTMENTS;
      badgeIcon = 'shieldWithCheckmark.svg';
    }
  } else if (isDeal && !isOpenToAllocations) {
    badgeIcon = (
      <WalletIcon className="text-green-semantic" width={24} height={24} />
    );
    titleText = LABELS.DEAL_CONCLUDED;
    badgeBackgroundColor = 'bg-green-phthalo-green';
  }

  const badgeIconContent = (
    <>
      {typeof badgeIcon === 'string' ? (
        <div className="w-6 h-6">
          <img
            src={`/images/syndicateStatusIcons/${badgeIcon}`}
            alt={titleText}
            style={{ height: '100%', width: '100%' }}
          />
        </div>
      ) : (
        <div className="m-0">{badgeIcon}</div>
      )}
    </>
  );

  return (
    <div className="h-fit-content rounded-3xl bg-gray-syn8 chromatic-ignore">
      <div
        className={`h-auto sm:h-20 ring ring-black w-full px-8 py-4 rounded-2xl ${badgeBackgroundColor} flex flex-shrink-0 justify-between items-center`}
        data-tip
        data-for="status-tooltip"
      >
        {loading || merkleLoading || claimLoading ? (
          <SkeletonLoader width="2/3" height="7" borderRadius="rounded-full" />
        ) : (
          <div className="flex w-full">
            <div className="flex mt-4 sm:hidden">{badgeIconContent}</div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 space-x-4 sm:space-y-0 w-full flex-nowrap">
              {/* Title + badge */}
              <div className="flex items-center space-x-4 flex-shrink-0">
                <div className="hidden sm:block">{badgeIconContent}</div>
                <div className="flex justify-between items-center w-full leading-snug ml-4">
                  <H4>{titleText}</H4> <B2>{subTitleText}</B2>
                </div>
              </div>

              {/* Countdown */}
              <div>
                {depositsEnabled &&
                !syndicateCreationFailed &&
                !showConfettiSuccess &&
                !hideCountdown ? (
                  <span>{`Closes in ${getCountDownDays(
                    endTime.toString()
                  )}`}</span>
                ) : null}

                {/* deals  */}
                {isDeal &&
                dealEndTime !== undefined &&
                !isReviewingDealCommittments ? (
                  <>
                    <div>
                      {getCountDownDays(dealEndTime.toString())} left to
                      allocate
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tooltip */}
      {depositsEnabled &&
      !syndicateCreationFailed &&
      !showConfettiSuccess &&
      !hideCountdown ? (
        <ReactTooltip
          id="status-tooltip"
          place="top"
          effect="solid"
          className="actionsTooltip"
          arrowColor="#222529"
          backgroundColor="#222529"
        >
          {`Closing to deposits on ${getFormattedDateTimeWithTZ(endTime)}`}
        </ReactTooltip>
      ) : isDeal &&
        dealEndTime !== undefined &&
        !isReviewingDealCommittments ? (
        <ReactTooltip
          id="status-tooltip"
          place="top"
          effect="solid"
          className="actionsTooltip"
          arrowColor="#222529"
          backgroundColor="#222529"
        >
          {`Closing to allocations on ${getFormattedDateTimeWithTZ(
            dealEndTime ? dealEndTime : 0
          )}`}
        </ReactTooltip>
      ) : null}
    </div>
  );
};

export default StatusBadge;
